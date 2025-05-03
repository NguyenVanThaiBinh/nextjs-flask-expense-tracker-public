
<p align="center">
  <a href="https://tracker-binh-hu.vercel.app/">
    <img src="https://tracker-binh-hu.vercel.app/Icon.jpg"  height="96" ">
    <h3 align="center">Next.js Flask Expense Note APP</h3>
  </a>
</p>

<p align="center">Simple Next.js that uses <a href="https://flask.palletsprojects.com/">Flask</a> as the API backend.</p>

<br/>

## Introduction

This is a hybrid Next.js + Python app that uses Next.js as the frontend and Flask as the API backend. You can note your Expense Note, then it's be save in PostgresSQL.

## How It Works

The Python/Flask server is mapped into to Next.js app under `/api/`.

This is implemented using [`next.config.js` rewrites](https://github.com/vercel/examples/blob/main/python/nextjs-flask/next.config.js) to map any request to `/api/:path*` to the Flask API, which is hosted in the `/api` folder.

On localhost, the rewrite will be made to the `localhost:8080` port, which is where the Flask server is running.

In production, the Flask server is hosted as [Python serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python) on Vercel.

## Demo

https://tracker.nguyenvanthaibinh.com/

## Getting Started

#### First, install the dependencies

Frontend:

```bash
npm install
# or
yarn install
```

Backend:

```bash
pip3 install -r requirements.txt
```
#### Update api/config.py file for PostgreSQL database, google API,...



#### Then, run app by

Frontend:

```bash
pnpm run next-dev
# or
yarn dev
```

Backend:

```bash
python -m flask --app api/index --debug run --host localhost -p 8080
```

Open [http://localhost:3000] with your browser to see the result.

The Flask server will be running on [http://localhost:8080] – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Flask Documentation](https://flask.palletsprojects.com/en/1.1.x/) - learn about Flask features and API.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
