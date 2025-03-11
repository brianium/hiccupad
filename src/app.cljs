(ns app
  (:require [clojure.string :as str]))

(defn get-element-by-id [id]
  (js/document.getElementById id))

(defn parse-attributes [attrs-string]
  (when (and attrs-string (not (str/blank? attrs-string)))
    (let [attr-pattern #"([^\s=]+)(?:=\"([^\"]*)\")?"
          matches (re-seq attr-pattern attrs-string)]
      (into {} 
            (map (fn [[_ name value]] 
                   [(str ":" name) (or value true)]) 
                 matches)))))

(defn strip-html-comments [html]
  (str/replace html #"<!--[\s\S]*?-->" ""))

(defn normalize-whitespace [text]
  (-> text
      (str/replace #"\s+" " ")
      str/trim))

(defn js-array->clj-vec [arr]
  (let [result (transient [])
        len (.-length arr)]
    (loop [i 0]
      (if (< i len)
        (do
          (conj! result (aget arr i))
          (recur (inc i)))
        (persistent! result)))))

(defn has-multiple-roots? [html]
  (let [cleaned-html (-> html
                         strip-html-comments
                         str/trim)
        ;; Create a temporary DOM to count top-level elements
        temp-div (js/document.createElement "div")]
    
    ;; Set the HTML content
    (set! (.-innerHTML temp-div) cleaned-html)
    
    ;; Count the number of element nodes (nodeType 1) at the top level
    (let [child-nodes (.-childNodes temp-div)
          element-count (loop [i 0
                               count 0]
                          (if (< i (.-length child-nodes))
                            (let [node (aget child-nodes i)]
                              (recur (inc i) 
                                     (if (= (.-nodeType node) 1)
                                       (inc count)
                                       count)))
                            count))]
      (> element-count 1))))

(defn simple-html->hiccup [html]
  (let [html (-> html
                 strip-html-comments
                 str/trim)
        has-html-tag (re-find #"<html[\s>]" html)
        has-body-tag (re-find #"<body[\s>]" html)
        has-head-tag (re-find #"<head[\s>]" html)
        
        ;; Check for multiple roots
        multiple-roots (has-multiple-roots? html)
        
        ;; For multiple root elements, wrap in a container
        parse-html (if multiple-roots
                     (str "<div id=\"multiple-roots-wrapper\">" html "</div>")
                     html)
        
        dom-parser (js/DOMParser.)
        doc (.parseFromString dom-parser parse-html "text/html")]
    
    (letfn [(element->hiccup [el]
              (if (= (.-nodeType el) 3) ; Text node
                (let [text (normalize-whitespace (.-textContent el))]
                  (when-not (str/blank? text)
                    text))
                
                (when (= (.-nodeType el) 1) ; Element node
                  (let [tag-name (str/lower-case (.-tagName el))
                        is-wrapper (and multiple-roots
                                        (= tag-name "div") 
                                        (= (.-id el) "multiple-roots-wrapper"))
                        skip-tag (or 
                                  (and (= tag-name "html") (not has-html-tag))
                                  (and (= tag-name "body") (not has-body-tag))
                                  (and (= tag-name "head") (not has-head-tag)))
                        tag-kw (str ":" tag-name)
                        attrs (when (.-attributes el)
                                (let [attrs-map {}]
                                  (loop [i 0
                                         result attrs-map]
                                    (if (< i (.-length (.-attributes el)))
                                      (let [attr (aget (.-attributes el) i)
                                            name (str ":" (.-name attr))
                                            value (.-value attr)]
                                        (recur (inc i) (assoc result name value)))
                                      (when (> (count result) 0)
                                        result)))))
                        children (js-array->clj-vec (.-childNodes el))
                        child-hiccups (filter identity (map element->hiccup children))]
                    
                    (cond
                      ;; If this is our multiple roots wrapper, return children with special marker
                      is-wrapper
                      (into ["__multiple_roots__"] child-hiccups)
                      
                      ;; If we're skipping this tag, just return its children directly
                      skip-tag
                      (if (empty? child-hiccups)
                        nil
                        (if (= (count child-hiccups) 1)
                          (first child-hiccups)
                          child-hiccups))
                      
                      ;; Otherwise return the normal hiccup form
                      :else
                      (if attrs
                        (into [tag-kw attrs] child-hiccups)
                        (into [tag-kw] child-hiccups)))))))]
      
      ;; Process the document and extract the actual content
      (let [raw-result (element->hiccup (.-documentElement doc))]
        (js/console.log "Multiple roots:" multiple-roots)
        
        ;; Check if we have multiple roots that need to be wrapped in a list
        (cond
          ;; If we have multiple roots, wrap children in a list
          (and multiple-roots
               (vector? raw-result) 
               (= (first raw-result) "__multiple_roots__"))
          (into ["list"] (rest raw-result))
          
          ;; If we have a single root but got the special marker, just return the first child
          (and (not multiple-roots)
               (vector? raw-result) 
               (= (first raw-result) "__multiple_roots__")
               (> (count raw-result) 1))
          (second raw-result)
          
          ;; If we got a single hiccup vector, return it
          (and (vector? raw-result) 
               (string? (first raw-result)) 
               (str/starts-with? (first raw-result) ":"))
          raw-result
          
          ;; If we got a collection, find the first real element
          (vector? raw-result)
          (loop [items raw-result]
            (cond
              (empty? items) nil
              (and (vector? (first items)) 
                   (not (empty? (first items)))
                   (string? (first (first items)))
                   (str/starts-with? (first (first items)) ":"))
              (first items)
              :else
              (recur (rest items))))
          
          ;; Otherwise just return what we got
          :else raw-result)))))

(defn pretty-print-hiccup [hiccup]
  (let [indent-level (atom 0)
        result (atom "")]
    
    (letfn [(indent []
              (apply str (repeat (* 2 @indent-level) " ")))
            
            (append! [s]
              (swap! result str s))
            
            (pp-map [m]
              (append! "{")
              (let [entries (js/Object.entries m)
                    len (.-length entries)]
                (loop [i 0]
                  (when (< i len)
                    (let [entry (aget entries i)
                          k (aget entry 0)
                          v (aget entry 1)]
                      (append! k)
                      (append! " ")
                      (append! (pr-str v))
                      ;; Add space instead of comma between entries
                      (when (< (inc i) len)
                        (append! " ")))
                    (recur (inc i)))))
              (append! "}"))
            
            (pp [form]
              (cond
                (and (vector? form) (= (first form) "list"))
                (do
                  (append! "(list")
                  (swap! indent-level inc)
                  (doseq [child (rest form)]
                    (append! "\n")
                    (append! (indent))
                    (pp child))
                  (swap! indent-level dec)
                  (append! ")"))
                
                (vector? form)
                (do
                  (append! "[")
                  (when-let [tag (first form)]
                    (append! tag)
                    (when (and (> (count form) 1) (map? (second form)))
                      (append! " ")
                      (pp-map (second form))))
                  (when (> (count form) (if (map? (second form)) 2 1))
                    (swap! indent-level inc)
                    (doseq [child (drop (if (map? (second form)) 2 1) form)]
                      (append! "\n")
                      (append! (indent))
                      (pp child))
                    (swap! indent-level dec))
                  (append! "]"))
                
                (map? form)
                (pp-map form)
                
                :else (append! (pr-str form))))]
      
      (pp hiccup)
      @result)))

(defn translate [event]
  (let [html-input (.. event -target -value)
        result-el (get-element-by-id "result-output")]
    (when (and html-input (not (str/blank? html-input)))
      (try
        (let [hiccup (simple-html->hiccup html-input)
              pretty-hiccup (pretty-print-hiccup hiccup)]
          ;; Clear the result element
          (set! (.-innerHTML result-el) "")
          
          ;; Create pre and code elements
          (let [pre-el (js/document.createElement "pre")
                code-el (js/document.createElement "code")]
            
            ;; Add classes to elements
            (.add (.-classList pre-el) "whitespace-pre-wrap")
            
            ;; Add Tailwind classes for compact text
            (.add (.-classList code-el) "text-xs")
            (.add (.-classList code-el) "leading-tight")
            (.add (.-classList code-el) "font-mono")
            (.add (.-classList code-el) "language-clojure") ;; Add language class for Prism
            
            ;; Set the hiccup content
            (set! (.-textContent code-el) pretty-hiccup)
            
            ;; Append elements
            (.appendChild pre-el code-el)
            (.appendChild result-el pre-el)
            
            ;; Apply syntax highlighting
            (when (and js/window.Prism js/window.Prism.highlightElement)
              (js/window.Prism.highlightElement code-el))))
        (catch js/Error e
          (set! (.-innerHTML result-el) 
                (str "<div class=\"text-error\">Error parsing HTML: " 
                     (.-message e) 
                     "</div>")))))
    
    ;; Show/hide the copy button
    (let [copy-button (get-element-by-id "copy-button")]
      (if (and html-input (not (str/blank? html-input)))
        (.remove (.-classList copy-button) "hidden")
        (.add (.-classList copy-button) "hidden")))
    
    (js/console.log "Translation complete")))

(defn toggle-convert-button []
  (let [textarea (get-element-by-id "html-input")
        convert-button (get-element-by-id "convert-button")]
    (if (and textarea (not (str/blank? (.-value textarea))))
      (.remove (.-classList convert-button) "hidden")
      (.add (.-classList convert-button) "hidden"))))

(defn copy-to-clipboard []
  (let [result-el (get-element-by-id "result-output")
        copy-button (get-element-by-id "copy-button")
        code-el (when result-el (.querySelector result-el "code"))]
    (when (and code-el copy-button)
      (let [text-content (.-textContent code-el)
            temp-textarea (js/document.createElement "textarea")]
        (set! (.-value temp-textarea) text-content)
        (set! (.-style temp-textarea) "position: absolute; left: -9999px;")
        (.appendChild js/document.body temp-textarea)
        (.select temp-textarea)
        (js/document.execCommand "copy")
        (.removeChild js/document.body temp-textarea)
        
        ;; Show success feedback
        (let [icon-elements (.querySelectorAll copy-button "svg")]
          (when (and (> (.-length icon-elements) 0) (> (.-length icon-elements) 1))
            (.add (.-classList (aget icon-elements 0)) "hidden")
            (.remove (.-classList (aget icon-elements 1)) "hidden")
            (js/setTimeout (fn []
                             (.remove (.-classList (aget icon-elements 0)) "hidden")
                             (.add (.-classList (aget icon-elements 1)) "hidden"))
                           1500)))))))

(defn init []
  (let [textarea (get-element-by-id "html-input")
        convert-button (get-element-by-id "convert-button")
        copy-button (get-element-by-id "copy-button")]
    (when (and textarea convert-button copy-button)
      (.addEventListener textarea "input" (fn [_] (toggle-convert-button)))
      (.addEventListener textarea "blur" translate)
      (.addEventListener convert-button "click" translate)
      (.addEventListener copy-button "click" (fn [_] (copy-to-clipboard))))))
  
(init)
