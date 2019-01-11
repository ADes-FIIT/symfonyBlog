<?php

namespace App\Handler;

use App\Entity\Blog;
use App\Factory\EntityFactory;
use App\Form\CommentType;
use App\Repository\CommentRepository;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;

class CommentFormHandler
{
    private $formFactory;
    private $flashBag;
    private $commentRepo;
    private $factory;

    public function __construct(
        FormFactoryInterface $formFactory,
        FlashBagInterface $flashBag,
        CommentRepository $commentRepo,
        EntityFactory $factory
    ){
        $this->formFactory = $formFactory;
        $this->flashBag = $flashBag;
        $this->commentRepo = $commentRepo;
        $this->factory = $factory;
    }

    public function handle(Request $request, Blog $blog)
    {
        $comment = $this->factory->createComment($blog);
        $form = $this->formFactory->create(CommentType::class, $comment);

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                if($comment->getAuthor() === null)
                {
                    $this->flashBag->add('error', 'comment.login');
                    return null;
                }

                $this->commentRepo->saveWpersist($comment);

                return null;
            }
        }

        return $form;
    }
}