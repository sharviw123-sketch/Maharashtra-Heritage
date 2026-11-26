# Maharashtra Heritage — Project 1 (Web Tech)

A responsive, accessible website about three monuments of Maharashtra — the **Bhuleswar Temple**, the **Sangameshwar Temple** and the **Bhaja Caves** — seen through Indian Knowledge Systems (IKS). Includes interactive quizzes and a simple login that saves quiz scores.

Built with plain **HTML, CSS and JavaScript** (no frameworks, no backend).

- **Figma prototype:** _paste your Figma link here_
- **GitHub repository:** _paste your GitHub link here_

## How to run

1. Open this folder in **VS Code**.
2. Open `index.html` in a browser, or right-click it and choose **Open with Live Server** (Live Server extension).
3. No installation or server needed.

## Folder structure

```
index.html          all pages (semantic HTML)
css/style.css       all styling + responsive rules
js/quiz-data.js     quiz questions (objects and arrays)
js/main.js          routing, quiz logic, login, interactions
images/             compressed photos (about 3.7 MB total)
```

## What it demonstrates

| Requirement | Where |
| --- | --- |
| Semantic HTML | `header`, `nav`, `main`, `article`, `section`, `figure`, `blockquote`, `dl`, `footer`; one `h1` per page |
| Accessible | skip link, keyboard-usable everything, visible focus, ARIA labels/live regions, modal focus trap, alt text, `prefers-reduced-motion` |
| Responsive | CSS grid/flexbox with breakpoints at 1100, 850 and 480 px; hamburger menu on mobile |
| Interactive | quiz (A–D keys work), photo galleries, login/sign up, saved scores, scroll fade-ins |
| DOM + events | `js/main.js` creates and updates elements, listens for click, keydown, submit and hashchange |
| Loops, arrays, conditionals | quiz rendering (`for` loop), `quizData` arrays, score messages (`if` chain) |
| Variables, functions, objects | quiz state variables, small functions, quiz and user objects |

## Pages

Pages are shown with URL hashes, so the Back button works: `#/home`, `#/bhuleswar`, `#/sangameshwar`, `#/bhaja`, `#/iks`, `#/about`, `#/quizzes`, `#/quiz/bhaja`.

## Note on login

There is no server. Accounts and scores are stored in the browser's `localStorage` on the same device. This is a front-end demo, not real security.

## Upload to GitHub

```bash
cd Sharvi_Wakchaure_Project1
git init
git add .
git commit -m "Project 1: Maharashtra Heritage website"
git branch -M main
git remote add origin https://github.com/<your-username>/Sharvi_Wakchaure_Project1.git
git push -u origin main
```

Optional live link: on GitHub go to **Settings → Pages → Deploy from a branch → main / (root)**.
