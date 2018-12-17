<?php

namespace App\Handler;

use App\Entity\Blog;
use App\Entity\Comment;
use App\Form\CommentType;
use App\Repository\CommentRepository;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Templating\EngineInterface;

class CommentFormHandler
{
    private $formFactory;
    private $flashBag;
    private $security;
    private $commentRepo;

    public function __construct(
        FormFactoryInterface $formFactory,
        FlashBagInterface $flashBag,
        Security $security,
        CommentRepository $commentRepo
    ){
        $this->formFactory = $formFactory;
        $this->flashBag = $flashBag;
        $this->security = $security;
        $this->commentRepo = $commentRepo;
    }

    public function handle(Request $request, Blog $blog)
    {
        $comment = new Comment();
        $form = $this->formFactory->create(CommentType::class, $comment);

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $user = $this->security->getUser();

                if(!$user) {
                    $this->flashBag->add('error', 'comment.login');
                    return null;
                }

                $comment->setAuthor($user);
                $comment->setBlog($blog);
                $this->commentRepo->saveWpersist($comment);

                return null;
            }
        }

        return $form;
    }
}