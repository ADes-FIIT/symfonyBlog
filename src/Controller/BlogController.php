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
     * @Route("/{id}", name="showblog", requirements={"id"="\d+"})
     * @param Request $request The one and only request
     * @param integer $id part of the route
     * @return mixed rendered page
     */
    public function show(Request $request, int $id)
    {
        $blog = $this->dbService->loadShowPost($id);
        $comments = $this->dbService->loadShowComments($id);
        $form = $this->commentHandler->handle($request, $blog);

        if ($form == null)
            return $this->redirect($this->generateUrl('showblog', ['pageid' => $id]));

        return $this->render('blog/show.html.twig', [
            'id' => $id,
            'blog' => $blog,
            'comments' => $comments,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/add", name="add")
     * @param Request $request The one and only request
     * @return mixed rendered page
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
     * @return mixed rendered page
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
     * @param Request $request The one and only request
     * @param integer $id part of the route
     * @return mixed rendered page
     */
    public function editMyPost(Request $request, int $id)
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
     * @param integer $id part of the route
     * @return mixed redirect to users posts
     */
    public function deleteMyPost(int $id)
    {
        $this->dbService->deleteMyPost($id);

        return $this->redirect('/myposts');
    }
}