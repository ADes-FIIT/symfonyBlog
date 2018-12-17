<?php

namespace App\Controller;

use App\Handler\AddPostFormHandler;
use App\Handler\CommentFormHandler;
use App\Handler\EditPostFormHandler;
use App\Service\DatabaseService;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class BlogController extends Controller
{
    private $dbService;
    private $commentHandler;
    private $addPostHandler;
    private $editPostHandler;

    public function __construct(
        DatabaseService $dbService,
        CommentFormHandler $commentHandler,
        AddPostFormHandler $addPostHandler,
        EditPostFormHandler $editPostHandler
    ){
        $this->dbService = $dbService;
        $this->commentHandler = $commentHandler;
        $this->addPostHandler = $addPostHandler;
        $this->editPostHandler = $editPostHandler;
    }

    /**
     * @Route("/{pageid}", name="showblog", requirements={"pageid"="\d+"})
     */
    public function show(Request $request, $pageid)
    {
        $blog = $this->dbService->loadShowPost($pageid);
        $comments = $this->dbService->loadShowComments($pageid);
        $form = $this->commentHandler->handle($request, $blog);

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
        $form = $this->addPostHandler->handle($request);

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
        $blogs = $this->dbService->loadMyPosts();

        return $this->render('blog/myposts.html.twig', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * @Route("/edit/{id}", name="editmypost", requirements={"id"="\d+"})
     */
    public function editMyPost(Request $request, $id)
    {
        $blog = $this->dbService->loadEditPost($id);
        $form = $this->editPostHandler->handle($request, $blog);

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
        $this->dbService->deleteMyPost($id);

        return $this->redirect('/myposts');
    }
}