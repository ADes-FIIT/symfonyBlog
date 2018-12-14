<?php

// src/Controller/BlogController.php

namespace App\Controller;

use App\Entity\Blog;
use App\Form\BlogPostFormType;
use App\Form\CommentType;
use App\Entity\Comment;
use App\Service\FormHandler;
use App\Service\PostsLoading;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

/**
 * Blog controller.
 */
class BlogController extends Controller
{
    private $postsLoading;
    private $formHandler;

    public function __construct(
        PostsLoading $postsLoading,
        FormHandler $formHandler
    ){
        $this->postsLoading = $postsLoading;
        $this->formHandler = $formHandler;
    }

    /**
     * @Route("/{pageid}", name="showblog", requirements={"pageid"="\d+"})
     */
    public function show(Request $request, $pageid)
    {
        $blog = $this->postsLoading->loadShowPost($pageid);
        $comments = $this->postsLoading->loadShowComments($pageid);
        $form = $this->formHandler->commentForm($request, $blog);

        if ($form == null)
            return $this->redirect($this->generateUrl('showblog', ['pageid' => $pageid]));

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
        $form = $this->formHandler->addPostForm($request);

        if ($form === null)
                return $this->redirect($this->generateUrl('myposts'));

        return $this->render('blog/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/myposts", name="myposts")
     */
    public function myPosts()
    {
        $blogs = $this->postsLoading->loadMyPosts();

        return $this->render('blog/myposts.html.twig', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * @Route("/edit/{id}", name="editmypost", requirements={"id"="\d+"})
     */
    public function editMyPost(Request $request, $id)
    {
        $blog = $this->postsLoading->loadEditPost($id);
        $form = $this->formHandler->editPostForm($request, $blog);

        if ($form === null)
            return $this->redirect($this->generateUrl('myposts'));

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
        $this->postsLoading->deleteMyPost($id);

        return $this->redirect('/myposts');
    }
}