import js from "@eslint/js"
import globals from "globals"
import { defineConfig } from "eslint/config"

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.browser },
		env: {
			es2021: true,
			browser: true, // если код для браузера
			node: true, // если используешь Node.js API
		},
		parserOptions: {
			sourceType: "module",
		},
	},
])
