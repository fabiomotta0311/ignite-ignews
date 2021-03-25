import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import Head from 'next/head'
import Link from 'next/link'
import router from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss'

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const [session] = useSession();

    useEffect(() => {
        if (session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    },[session])

    return(
       <>
        <Head>
            <title>{post.title} | Ignews</title>
        </Head>
        <main className={styles.container}>
            <article className={styles.post}>
                <h1 key={post.slug}>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div 
                    className={`${styles.postContent} ${styles.previewContent}`}
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                />
                <div className={styles.continueReading}>
                    Wanna continue reading?
                    <Link href="">
                        <a>Subscribe now 😉</a>
                    </Link>
                </div>
            </article>
        </main>
       </> 
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    // em páginas dinamicas [slug]: Quais paginas devem ser geradas estaticas no build
    return {
        paths: [
            //{ params: { slug: 'react-hook-swr---melhor-ux-no-consumo-de-api-no-front' } }
        ],
        fallback: 'blocking'
        // true: se o post ainda não foi gerado vai fazer a requisição no browser NoSEO
        // false: se post não gerado, devolve 404, não encontrado.
        // blocking: se post não gerado, gera via SSR (SEO)
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params

    const prismic = getPrismicClient()

    const response = await prismic.getByUID('post', String(slug),{})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0,3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post,
        },
        redirect: 60 * 30, // 30 minutos
    }


}