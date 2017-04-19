module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "handle-callback-err": "error",
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
            {"avoidEscape": true}
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 0,
        "react/jsx-uses-vars": 1,
        "react/jsx-uses-react": 1,
        "jsx-quotes": ["error", "prefer-single"]
    }
};
