## Getting Started

1. Run `npm install`
2. Run `npm run dev`
3. Run `npm install tailwindcss-animate`

## Link json db
1. run `npm install -g json-server`
2. run json server `json-server --watch db.json --port 3001`
3. add lines below in "scripts" section of package.json able to run server and api with this command `npm run start` : 
`
  "api": "json-server --watch db.json --port 3001",
  "start": "concurrently \"npm run api\" \"npm run dev\""
`
