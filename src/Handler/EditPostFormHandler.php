<?php

namespace App\Handler;

use App\Entity\Blog;
use App\Repository\BlogRepository;
use App\Form\BlogPostFormType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;

class EditPostFormHandler
{
    private $formFactory;
    private $blogRepo;

    public function __construct(FormFactoryInterface $formFactory, BlogRepository $blogRepo)
    {
        $this->formFactory = $formFactory;
        $this->blogRepo = $blogRepo;
    }

    public function handle(Request $request, Blog $blog)
    {
        $form = $this->formFactory->create(BlogPostFormType::class, $blog);

        if ('POST' == $request->getMethod()) {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $this->blogRepo->save($blog);

                return null;
            }
        }

        return $form;
    }
}