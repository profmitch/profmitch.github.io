# ✅ **MathJax in HTML – TeX Reference Sheet**

## 📌 1. **Script Tag (Include this in `<head>` or before closing `</body>`)**

```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```

---

## 📌 2. **Delimiters for Writing Math**

| Type    | Syntax                   | Example                 |
| ------- | ------------------------ | ----------------------- |
| Inline  | `\( ... \)` or `$...$`   | `\( a^2 + b^2 = c^2 \)` |
| Display | `\[ ... \]` or `$$...$$` | `\[ E = mc^2 \]`        |

> **Note**: MathJax v3 supports `$...$` and `$$...$$` by default, but v2 may need config tweaks.

---

## 📌 3. **Common TeX Commands (Examples)**

### 🔹 Greek Letters

```latex
\alpha \beta \gamma \Delta \theta \lambda \pi \Omega
```

👉 Renders: $\alpha \beta \gamma \Delta \theta \lambda \pi \Omega$

### 🔹 Superscripts/Subscripts

```latex
x^2 \quad a_1 \quad x_i^2
```

👉 Renders: $x^2 \quad a_1 \quad x_i^2$

### 🔹 Fractions & Roots

```latex
\frac{a}{b} \quad \sqrt{x} \quad \sqrt[3]{y}
```

👉 Renders: $\frac{a}{b} \quad \sqrt{x} \quad \sqrt[3]{y}$

### 🔹 Sums, Integrals, Limits

```latex
\sum_{i=1}^n i \quad \int_0^1 x^2 dx \quad \lim_{x \to 0} \frac{\sin x}{x}
```

👉 Renders:

$$
\sum_{i=1}^n i \quad \int_0^1 x^2 dx \quad \lim_{x \to 0} \frac{\sin x}{x}
$$

### 🔹 Brackets and Formatting

```latex
\left( \frac{a}{b} \right) \quad \text{if } x > 0
```

👉 Renders: $\left( \frac{a}{b} \right) \quad \text{if } x > 0$

---

## 📌 4. **Escaping TeX in HTML**

If you're placing TeX inline in HTML, make sure:

* You're not inside an attribute (`alt`, `title`, etc.) unless properly escaped.
* If in `innerHTML`, use raw `\( ... \)` or `\[ ... \)` without HTML-escaping special characters.

---

## 📌 5. **Disabling MathJax in Certain Blocks**

To prevent MathJax from rendering inside a specific tag:

```html
<pre class="no-mathjax">Some $text$ here that shouldn't render.</pre>
```

Then configure MathJax to skip that class in the JS config
