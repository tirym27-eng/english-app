# English Premium v55

Changes in this build:

- Fixed the white contour so it is only a frame border around UI cards/frames, not a viewport-wide line.
- Added context-aware explanations to course exercises. Existing `ⓘ Пояснение` buttons now explain the exact current exercise, its lesson topic, and the relevant way to solve it.
- Builder mistakes no longer trap the learner in the same question. A wrong sentence-building attempt is recorded and the learner moves to the next task.
- Mistakes from the current lesson are brought back in the final Review stage with: learner's attempt → expected sentence → exact reason for the error.
- Expanded the curriculum from 30 lessons to 140 lessons: 7 levels × 20 lessons, covering A0 through C2.
- Added dedicated C1 and C2 level-exam question sets.
- Preserved localStorage progress and the existing learning engine structure.

Validation performed:

- All inline JavaScript blocks pass `node --check`.
- HTML has one closing `</body>` and one closing `</html>`.
- Curriculum contains 7 levels and 140 lessons.
- The updated source `index.html` was copied to the generated `dist/public/index.html`.

Note: live iPhone/Safari behavior cannot be fully verified from this environment, so the build should still be opened once on the target phone/browser for final visual/interaction QA.
