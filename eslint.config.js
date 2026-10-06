import js from "@eslint/js";
import globals from "globals";
import html from "eslint-plugin-html";

export default [
    js.configs.recommended,

    {
        files: ["**/*.js", "**/*.html"],
        plugins: {
            html
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "semi": ["error", "always"],
            "quotes": ["error", "double"],
            "no-unused-vars": "warn",
            "eqeqeq": "error"
        }
    }
];