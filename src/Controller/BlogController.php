<?php
// src/Controller/BlogController.php

namespace App\Controller;

use App\Entity\Blog;
use App\Form\BlogPostFormType;
use App\Form\CommentType;
use App\Entity\Comment;
use App\Repository\BlogRepository;
use mysql_xdevapi\Exception;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;


/**
 * Blog controller.
 */
class BlogController extends Controller
{
    /**
     * @Route("/{pageid}", name="showblog", requirements={"pageid"="\d+"})
     * @Method("GET|POST")
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

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                try {
                    $user = $this->getUser()->getUsername();
                    $comment->setAuthor($user);
                }
                catch (\Throwable $t){
                    $comment->setAuthor("Anonymous" . session_id());
                }

                $comment->setBlogId($pageid);

                $em->persist($comment);
                $em->flush();

                return $this->redirect($this->generateUrl('showblog', array('pageid' => $pageid)));
            }
        }

        return $this->render('blog/show.html.twig', [
            'pageid'    => $pageid,
            'blog'      => $blog,
            'comments'  => $comments,
            'form'      => $form->createView(),
        ]);
    }

    /**
     * @Route("/add", name="add")
     * @Method("GET|POST")
     */
    public function post(Request $request)
    {
        $blog = new Blog();
        $form = $this->createForm(BlogPostFormType::class, $blog);
        $this->request = $request;

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();

                $user = $this->getUser()->getUsername();
                $blog->setAuthor($user);

                $em->persist($blog);
                $em->flush();

                return $this->redirect($this->generateUrl('myposts'));
            }
        }

        return $this->render('blog/add.html.twig', array(
            'form' => $form->createView()
        ));
    }

    /**
     * @Route("/myposts", name="myposts")
     */
    public function myPosts()
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Blog');

        $username = $this->getUser()->getUsername();

        $blogs = $repo->findUserBlogs($username);

        if (!$blogs) {
            $errorMessage = 1;
            return $this->render('blog/myposts.html.twig', [
                'errorMessage' => $errorMessage,
            ]);
        }

        return $this->render('blog/myposts.html.twig', [
            'blogs'      => $blogs,
        ]);
    }

    /**
     * @Route("/edit/{id}", name="editmypost", requirements={"id"="\d+"})
     * @Method("GET|POST")
     */
    public function editMyPost(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Blog');
        $blog = $repo->findBlogById($id);

        $form = $this->createForm(BlogPostFormType::class, $blog);
        $this->request = $request;

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();

                $em->flush();

                return $this->redirect($this->generateUrl('myposts'));
            }
        }

        return $this->render('blog/edit.html.twig', array(
            'blog' => $blog,
            'form' => $form->createView()
        ));
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
        $em->flush();

        return $this->redirect("/myposts");
    }
}