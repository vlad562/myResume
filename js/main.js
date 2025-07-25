/* jshint esversion: 6 */

import html2pdf from "html2pdf.js";
import "../css/style.css";
import "../css/keyframes.css";
import "../css/media.css";
import "../css/animation.css";

const classLimits = {
	"resume__greeting": 30,
	"resume__position": 30,
	"resume__language-name": 30,
	"resume__job-date": 30,
	"resume__job-position": 30,
	"resume__job-company": 30,
	"resume__education-text": 30,
	"resume__education-tags": 100,
	"resume__education-program": 30,
	"resume__interests-item": 30,
	"resume__email-text": 100,
	"resume__section-title": 30,
	"resume__name": 24,
	"resume__job-title": 30,
	"resume__section-header": 30,
	"resume__tools-title": 30,
	"resume__education-time": 15,
	"resume__email-header": 1000,
	"resume__interests-header": 100,
	"resume__education-header": 100,
};

const tags = "p, h1, h2, h3, h4, h5";

// Функция сохранения в localStorage
function saveContent(key, value) {
	localStorage.setItem(key, value);
}
// Функция загрузки из localStorage
function loadContent(key) {
	return localStorage.getItem(key);
}

document.querySelectorAll(tags).forEach((el, idx) => {
	const matchedClass = Object.keys(classLimits).find(cls =>
		el.classList.contains(cls)
	);
	if (matchedClass) {
		const limit = classLimits[matchedClass];
		el.setAttribute("contenteditable", "true");
		el.setAttribute("spellcheck", "false");

		// Уникальный ключ
		const storageKey = matchedClass + "-" + idx;

		// Загружаем сохраненный текст, если есть
		const saved = loadContent(storageKey);
		if (saved) {
			el.innerText = saved;
		}

		el.addEventListener("input", () => {
			if (el.innerText.length > limit) {
				el.innerText = el.innerText.slice(0, limit);
				const range = document.createRange();
				const sel = window.getSelection();
				range.selectNodeContents(el);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);
			}
			saveContent(storageKey, el.innerText);
		});
	}
});

document.querySelectorAll(".resume__job-list li").forEach(el => {
	const limit = 1000;
	el.setAttribute("contenteditable", "true");
	el.setAttribute("spellcheck", "false");

	// используем уникальный ключ
	const storageKey = el.className + "-" + el.textContent.slice(0, 10);

	// Загружаем сохраненный текст, если есть
	const saved = loadContent(storageKey);
	if (saved) {
		el.innerText = saved;
	}

	el.addEventListener("input", () => {
		if (el.innerText.length > limit) {
			el.innerText = el.innerText.slice(0, limit);
			// курсор в конец
			const range = document.createRange();
			const sel = window.getSelection();
			range.selectNodeContents(el);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);
		}
		saveContent(storageKey, el.innerText);
	});
});

document.querySelectorAll("p, h1, h2, h3, h4, h5").forEach(el => {
	el.classList.add("ripple");

	el.addEventListener("click", function (e) {
		const ripple = document.createElement("span");
		ripple.classList.add("ripple-effect");

		const rect = el.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		ripple.style.width = ripple.style.height = size + "px";

		const x = e.clientX - rect.left - size / 2;
		const y = e.clientY - rect.top - size / 2;
		ripple.style.left = x + "px";
		ripple.style.top = y + "px";

		el.appendChild(ripple);

		ripple.addEventListener("animationend", () => {
			ripple.remove();
		});
	});
});

document
	.querySelectorAll(".resume__language-range")
	.forEach((wrapper, index) => {
		const input = wrapper.querySelector(".range-input");
		const fill = wrapper.querySelector(".range-fill");

		const storageKey = `language-range-${index}`;

		const savedValue = localStorage.getItem(storageKey);
		if (savedValue !== null) {
			input.value = savedValue;
			fill.style.width = savedValue + "%";
		} else {
			fill.style.width = input.value + "%";
		}

		input.addEventListener("input", () => {
			fill.style.width = input.value + "%";
			localStorage.setItem(storageKey, input.value);
		});
	});

document.getElementById("download-btn").addEventListener("click", () => {
	const element = document.querySelector(".resume");

	const fadedElements = Array.from(document.querySelectorAll(".fade-in"));

	fadedElements.forEach(el => el.classList.remove("fade-in"));

	const downloadBtn = document.getElementById("download-btn");
	downloadBtn.style.display = "none";

	const opt = {
		margin: 0,
		filename: "resume.pdf",
		image: { type: "jpeg", quality: 0.98 },
		html2canvas: {
			scale: 2,
			useCORS: true,
		},
		jsPDF: {
			unit: "mm",
			format: "a4",
			orientation: "portrait",
		},
		pagebreak: { mode: ["css", "avoid-all"] },
	};

	html2pdf()
		.set(opt)
		.from(element)
		.save()
		.then(() => {
			downloadBtn.style.display = "block";

			fadedElements.forEach(el => el.classList.add("fade-in"));
		})
		.catch(err => {
			console.error("Ошибка при создании PDF:", err);
			downloadBtn.style.display = "block";

			fadedElements.forEach(el => el.classList.add("fade-in"));
		});
});
