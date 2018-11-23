<?php
// src/Controller/BlogController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\BlogRepository;
use Symfony\Component\HttpFoundation\Request;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use App\Entity\Blog;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use App\Form\BlogPostFormType;

/**
 * Blog controller.
 */
class BlogController extends Controller
{
    /**
     * @Route("/{pageid}", name="blog", requirements={"pageid"="\d+"})
     */
    public function show($pageid)
    {
        $em = $this->getDoctrine()->getManager();

        $repo = $em->getRepository('App:Blog');

        $blog = $repo->find($pageid);

        if (!$blog) {
            throw $this->createNotFoundException('Unable to find Blog post/s.');
        }

        /*$comments = $em->getRepository('App:Comment')
            ->getCommentsForBlog($blog->getId());*/

        return $this->render('blog/show.html.twig', [
                'blog'      => $blog,/*,
                'comments'  => $comments*/
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
                echo "WUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";


                return $this->redirect($this->generateUrl('contact'));
            }
        }

        return $this->render('blog/add.html.twig', array(
            'form' => $form->createView()
        ));
    }
}