<?php

namespace App\Handler;

use App\Factory\EntityFactory;
use App\Repository\BlogRepository;
use App\Form\BlogPostFormType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;

class AddPostFormHandler
{
    private $formFactory;
    private $blogRepo;
    private $factory;

    public function __construct(
        FormFactoryInterface $formFactory,
        BlogRepository $blogRepo,
        EntityFactory $factory
    ){
        $this->formFactory = $formFactory;
        $this->blogRepo = $blogRepo;
        $this->factory = $factory;
    }

    public function handle(Request $request)
    {
        $blog = $this->factory->createBlogPost();
        $form = $this->formFactory->create(BlogPostFormType::class, $blog);

        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);

            if ($form->isValid())
            {
                $this->blogRepo->saveWpersist($blog);
                return null;
            }
        }

        return $form;
    }
}