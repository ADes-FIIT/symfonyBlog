<?php

// src/Controller/BlogController.php

namespace App\Controller;

use App\Entity\Blog;
use App\Form\BlogPostFormType;
use App\Form\CommentType;
use App\Entity\Comment;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

/**
 * Blog controller.
 */
class BlogController extends Controller
{
    /**
     * @Route("/{pageid}", name="showblog", requirements={"pageid"="\d+"})
     */
    public function show(Request $request, $pageid)
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Blog');
        $blog = $repo->find($pageid);
        $comment = new Comment();
        $form = $this->createForm(CommentType::class, $comment);
        $this->request = $request;

        if (!$blog) {
            throw $this->createNotFoundException('Unable to find Blog post/s.');
        }

        $comments = $em->getRepository('App:Comment')
            ->getCommentsForBlog($pageid);

        if ('POST' == $request->getMethod()) {
            $form->handleRequest($request);

            if ($form->isValid()) {
                try {
                    $comment->setAuthor($this->getUser());
                } catch (\Throwable $t) {
                    //TODO handle user not logged in when commenting
                }

                $comment->setBlog($blog);

                $em->persist($comment);
                $em->flush();

                return $this->redirect($this->generateUrl('showblog', ['pageid' => $pageid]));
            }
        }

        return $this->render('blog/show.html.twig', [
            'pageid' => $pageid,
            'blog' => $blog,
            'comments' => $comments,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/add", name="add")
     */
    public function post(Request $request)
    {
        $blog = new Blog();
        $form = $this->createForm(BlogPostFormType::class, $blog);
        $this->request = $request;

        if ('POST' == $request->getMethod()) {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();

                $blog->setAuthor($this->getUser());

                $em->persist($blog);
                $em->flush();

                return $this->redirect($this->generateUrl('myposts'));
            }
        }

        return $this->render('blog/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/myposts", name="myposts")
     */
    public function myPosts()
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Blog');

        $blogs = $repo->findUserBlogs($this->getUser());

        if (!$blogs) {
            $errorMessage = 1;

            return $this->render('blog/myposts.html.twig', [
                'errorMessage' => $errorMessage,
            ]);
        }

        return $this->render('blog/myposts.html.twig', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * @Route("/edit/{id}", name="editmypost", requirements={"id"="\d+"})
     */
    public function editMyPost(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Blog');
        $blog = $repo->findBlogById($id);

        $form = $this->createForm(BlogPostFormType::class, $blog);
        $this->request = $request;

        if ('POST' == $request->getMethod()) {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();

                $em->flush();

                return $this->redirect($this->generateUrl('myposts'));
            }
        }

        return $this->render('blog/edit.html.twig', [
            'blog' => $blog,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/delete/{id}", name="deletemypost", requirements={"id"="\d+"})
     */
    public function deleteMyPost($id)
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Blog');
        $blog = $repo->findBlogById($id);
        $em->remove($blog);

        $repo = $em->getRepository('App:Comment');
        $comments = $repo->getCommentsForBlog($id);
        foreach ($comments as $comment) {
            $em->remove($comment);
        }

        $em->flush();

        return $this->redirect('/myposts');
    }
}
