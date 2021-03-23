import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render(){
        return (
            <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com"></link>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>
                <link rel="shorcut icon" href="/favicon.png" type="image/png"></link>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
            </Html>
        )
    }
}