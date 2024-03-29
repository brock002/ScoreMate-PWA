## TODO:

-   add about, feedback pages
-   try different fonts
-   find tooltips for mobile UI
-   Data Export and Sharing: Export game data or share score summaries with fellow players via email or messaging apps. This feature facilitates post-game analysis and allows players to revisit memorable moments from their gaming sessions.
-   Sync Across Devices: Synchronize game progress and scores across multiple devices, enabling seamless transitions between smartphones, tablets, and other compatible gadgets.
-   Multi-Game Support: Seamlessly switch between different card games within the app. Whether you're playing one game for an entire session or switching between multiple games, Score Mate adapts to your needs.
-   Player Profiles: Create profiles for each player, including customizable avatars or icons for easy identification. Store player information and track individual performance over time.

---

---

---

## Following is the Initial README from Vite

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
export default {
    // other rules...
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: __dirname,
    },
}
```

-   Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-   Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
