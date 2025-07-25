/* jshint esversion: 6 */

import html2pdf from "html2pdf.js"
import "../css/style.css"
import "../css/keyframes.css"
import "../css/media.css"

// import "../css/style.css"
// import javascriptLogo from "../javascript.svg"
// import viteLogo from "/vite.svg"
// import { setupCounter } from "./counter.js"

// document.querySelector("#app").innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `;

// setupCounter(document.querySelector("#counter"));

const classLimits = {
	"resume__greeting": 30,
	"resume__position": 30,
	"resume__language-name": 30,
	"resume__job-date": 30,
	"resume__job-position": 30,
	"resume__job-company": 30,
	"resume__education-text": 30,
	"resume__education-tags": 30,
	"resume__education-program": 30,
	"resume__interests-item": 30,
	"resume__email-text": 30,
	"resume__section-title": 30,
	"resume__name": 24,
	"resume__job-title": 30,
	"resume__section-header": 30,
	"resume__tools-title": 30,
	"resume__education-time": 30,
	"resume__email-header": 1000,
	"resume__email-text": 100,
}

const tags = "p, h1, h2, h3, h4, h5"

// Функция сохранения в localStorage
function saveContent(key, value) {
	localStorage.setItem(key, value)
}
// Функция загрузки из localStorage
function loadContent(key) {
	return localStorage.getItem(key)
}

function getStorageKey(el) {
	// Найдём класс из classLimits, который есть у элемента
	return Object.keys(classLimits).find(cls => el.classList.contains(cls))
}

document.querySelectorAll(tags).forEach(el => {
	const matchedClass = Object.keys(classLimits).find(cls =>
		el.classList.contains(cls)
	)
	if (matchedClass) {
		const limit = classLimits[matchedClass]
		el.setAttribute("contenteditable", "true")
		el.setAttribute("spellcheck", "false")

		// Загружаем сохраненный текст, если есть, используя matchedClass как ключ
		const saved = loadContent(matchedClass)
		if (saved) {
			el.innerText = saved
		}

		el.addEventListener("input", () => {
			if (el.innerText.length > limit) {
				el.innerText = el.innerText.slice(0, limit)
				// курсор в конец
				const range = document.createRange()
				const sel = window.getSelection()
				range.selectNodeContents(el)
				range.collapse(false)
				sel.removeAllRanges()
				sel.addRange(range)
			}
			// Сохраняем под стабильным ключом matchedClass
			saveContent(matchedClass, el.innerText)
		})
	}
})


document.querySelectorAll(".resume__job-list li").forEach(el => {
	const limit = 1000
	el.setAttribute("contenteditable", "true")
	el.setAttribute("spellcheck", "false")

	// Для li используем уникальный ключ (класс + первые 10 символов текста)
	const storageKey = el.className + "-" + el.textContent.slice(0, 10)

	// Загружаем сохраненный текст, если есть
	const saved = loadContent(storageKey)
	if (saved) {
		el.innerText = saved
	}

	el.addEventListener("input", () => {
		if (el.innerText.length > limit) {
			el.innerText = el.innerText.slice(0, limit)
			// курсор в конец
			const range = document.createRange()
			const sel = window.getSelection()
			range.selectNodeContents(el)
			range.collapse(false)
			sel.removeAllRanges()
			sel.addRange(range)
		}
		saveContent(storageKey, el.innerText)
	})
})

document.getElementById("download-btn").addEventListener("click", () => {
	const element = document.querySelector(".resume") // или весь body

	document.getElementById("download-btn").style.display = "none"

	const opt = {
		margin: 0.5,
		filename: "resume.pdf",
		image: { type: "jpeg", quality: 0.98 },
		html2canvas: { scale: 3 },
		jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
	}

	html2pdf()
		.set(opt)
		.from(element)
		.save()
		.then(() => {
			document.getElementById("download-btn").style.display = "block"
		})
})

const bars = document.querySelectorAll(".resume__language-bar")
bars.forEach(bar => {
	const observer = new ResizeObserver(entries => {
		for (let entry of entries) {
			const width = entry.contentRect.width
			console.log(`New width: ${width}px`)
			// Можно пересчитать процент, если нужно
		}
	})
	observer.observe(bar)
})

document.querySelectorAll("p, h1, h2, h3, h4, h5, li").forEach(el => {
	el.classList.add("ripple") // добавляем класс, чтобы CSS применился

	el.addEventListener("click", function (e) {
		const ripple = document.createElement("span")
		ripple.classList.add("ripple-effect")

		const rect = el.getBoundingClientRect()
		const size = Math.max(rect.width, rect.height)
		ripple.style.width = ripple.style.height = size + "px"

		const x = e.clientX - rect.left - size / 2
		const y = e.clientY - rect.top - size / 2
		ripple.style.left = x + "px"
		ripple.style.top = y + "px"

		el.appendChild(ripple)

		ripple.addEventListener("animationend", () => {
			ripple.remove()
		})
	})
})
