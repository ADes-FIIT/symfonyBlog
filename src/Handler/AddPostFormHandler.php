<?php

namespace App\Handler;

use App\Entity\Blog;
use App\Repository\BlogRepository;
use App\Form\BlogPostFormType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class AddPostFormHandler
{
    private $formFactory;
    private $security;
    private $blogRepo;

    public function __construct(
        FormFactoryInterface $formFactory,
        Security $security,
        BlogRepository $blogRepo
    ){
        $this->formFactory = $formFactory;
        $this->security = $security;
        $this->blogRepo = $blogRepo;
    }

    public function handle(Request $request)
    {
        $blog = new Blog();
        $form = $this->formFactory->create(BlogPostFormType::class, $blog);

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $blog->setAuthor($this->security->getUser());

                $this->blogRepo->saveWpersist($blog);

                return null;
            }
        }

        return $form;
    }
}