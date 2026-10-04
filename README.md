# EENG250 · Electric Circuits I

Course website: lecture notes, slides and interactive practice sheets for each chapter.
Plain HTML, CSS and JavaScript, published with GitHub Pages. Equations use KaTeX, loaded from a CDN.

## Preview on your computer

Either double-click `index.html`, or run the small preview server (needs Node) and open http://localhost:8250:

```
node tools/serve.js
```

## Adding or updating a chapter

Drop the chapter's files folder (e.g. `EENG250 Ch2 Website Files`) into this folder. Only website files are published, so these folders never are. Then:

1. Copy the student PDFs (introduction, practice sheet, slides) to `chapters/02/`.
2. Copy the instructor PDFs (overview and key, quiz versions) to `private/chapters/02/` and list them in `private/index.html`.
3. In `course/course.js`, set the chapter's `status` to `"open"` and fill in each file's `href`. Quiz dates and exams go in `weeks[].events`.
4. For the online practice sheet, add `chapters/02/chapter.js` (page text and checklist) and `chapters/02/sheet.js` (questions), following Chapter 1, and set `sheet: true`.

## Layout

| Path | What it is |
|---|---|
| `index.html`, `chapter.html`, `sheet.html` | The three public page types |
| `course/course.js` | Course details, chapters and the schedule |
| `chapters/NN/` | Each chapter's introduction, practice sheet and PDFs |
| `assets/` | Styles (`base.css` for layout, `theme.css` for the look) and page scripts |
| `tools/serve.js` | Local preview server |
| `private/` | Instructor only: quizzes, keys, oral checks, syllabus. Git-ignored, so never pushed. |

Practice-sheet answers are checked in the student's browser; nothing is collected or sent anywhere.
