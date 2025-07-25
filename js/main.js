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
// `

// setupCounter(document.querySelector("#counter"))

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
	"resume__email-header": 30,
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

document.querySelectorAll(tags).forEach(el => {
	const matchedClass = Object.keys(classLimits).find(cls =>
		el.classList.contains(cls)
	)
	if (matchedClass) {
		const limit = classLimits[matchedClass]
		el.setAttribute("contenteditable", "true")

		// Загружаем сохраненный текст, если есть
		const saved = loadContent(el.className)
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
			saveContent(el.className, el.innerText)
		})
	}
})

document.querySelectorAll(".resume__job-list li").forEach(el => {
	const limit = 30
	el.setAttribute("contenteditable", "true")

	// Загружаем сохраненный текст, если есть
	const saved = loadContent(el.className + "-" + el.textContent.slice(0, 10))
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
		// Для li используем уникальный ключ, можно улучшить
		saveContent(el.className + "-" + el.textContent.slice(0, 10), el.innerText)
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
