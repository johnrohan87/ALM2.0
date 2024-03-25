# Installation

After downloading the file from Themeforest, You will find SuperProps.zip file. Then unzip the SuperProps.zip and run the following commands on SuperProps folder to get started with the project.

```
yarn
```

```
// For starting GatsbyJs Server run
yarn gatsby-dev
```

GatsbyJs server will start in `localhost:8000`

Available routes are below

```
/app
/appmodern
/appclassic
/appminimal
/saas
/saasmodern
/saasclassic
/saasminimal
/saasminimal2
/hosting
/hostingmodern
/portfolio
/ride
/crypto
/cryptomodern
/charity
/interior
/agency
/agencymodern
/agencydigital
/fooddelivery
/saascreative
/saasappcreative
/appminimal
/appminimal2
/webapp
/webappminimal
/webappcreative
```

# Folder Structure

```

/packages
/landing-gatsby [Gatsby version of the project]

```

# Stack We Have Used

1. Lerna (A tool for managing JavaScript projects with multiple packages. https://lernajs.io)
2. Yarn Workspace
3. Gatsby Js
4. Styled System and Styled Components
5. Firebase Deployment.
6. Vercel Deployment.

# Development

Follow the below procedure to go with the development process.

## GatsbyJs

For any specific template like the template under `/app` route. If you want to use this template only, then you have to follow below procedure.

1. Go to `/landing-gatsby/src/pages/`
2. now copy all the content from `app.js`
3. Paste all the content in `/landing-gatsby/src/pages/index.js`

Now for cleaning the unused code in your project follow the below procedure.

1. Now you can delete all other pages except `404.js`. That mean in your `/pages` folder you will have two files `index.js` and `404.js`
2. From `/landing-gatsby/src/containers/` folder you can delete all other folder except `App` and `Error`
3. From `/common/assets/image/` folder you can delete all other folder except `app`. Do not delete any files from there like `404.svg`, `error.svg` etc.
4. From `/common/data/` folder you can delete all other folder except `App`.
5. From `/common/theme/` folder you can delete all other folder except `app`. Do not delete the `index.js` file.

Now if you start your `gatsbyjs` server with `yarn gatsby-dev` then you will get your server running on `localhost:8000`

# Explaining Containers

In the `containers` directory you will get folder for our every template. If you want to use App template. Then in the `App` directory you will get folders containing different section of the template like `Banner`, `Footer`, `Testimonial`, `Navbar` etc.

All of these containers contains regular reactjs code.

# Deployment

For deploying your final project you have to build your project first. To build the project you have to follow below procedure.

### GatsbyJs

Run the below command on

```

yarn gatsby-build

// To check the build version locally run below command
// Not necessary if you don't want to check on your local.

yarn gatsby-serve

```

If you run `yarn gatsby-serve` then the build version the the project will start in `localhost:9000` . Navigate to the url you will get your site up and running.

## Running with Docker

To run the SuperProps Gatsby.js app in docker

```

yarn gatsby-build
docker build -t superprops/landing-gatsby -f ./packages/landing-gatsby/Dockerfile .
docker run -it -p 8000:8000 superprops/landing-gatsby:latest
open http://localhost:8000

```

# Deployment Support

## vercel.com

### GatsbyJs

We have given vercel.com deployment by default. For hosting the project in vercel.com first you have to go within the `packages/landing-gatsby`

Now run below command .

```

vercel

```

> **Make sure you have `vercel-cli` installed in your system.**

## Firebase

### GatsbyJs

To deploy to your site, run the following command from the `packages/landing-gatsby` directory.

```

yarn deploy

```

> **Make sure you have `firebase-tools` installed on your machine.**

## Netlify

At first, open an account on netlify and go to `sites` tab.

### GatsbyJs

If you want to host the `gatsbyjs` project, go to your command line and run this command on `packages/landing-gatsby` directory.

```

yarn build

```

After running above command go to `landing-gatsby` folder. You will find a `public` folder
there. Drag and drop this `public` folder on netlify `sites` tab.
