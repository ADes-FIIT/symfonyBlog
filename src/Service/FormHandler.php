<?php

namespace App\Service;

use App\Entity\Blog;
use App\Entity\User;
use App\Entity\Comment;
use App\Entity\Contact;
use App\Form\BlogPostFormType;
use App\Form\ContactType;
use App\Form\CommentType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\Templating\EngineInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Security\Core\Security;

/**
 * Class FormHandler
 * @package App\Service
 */
class FormHandler
{
    private $request;
    private $formFactory;
    private $flashBag;
    private $twig;
    private $mailer;
    private $params;
    private $security;
    private $postsLoading;

    public function __construct(
        FormFactoryInterface $formFactory,
        FlashBagInterface $flashBag,
        \Swift_Mailer $mailer,
        EngineInterface $twig,
        ParameterBagInterface $params,
        Security $security,
        PostsLoading $postsLoading
    ){
        $this->formFactory = $formFactory;
        $this->flashBag = $flashBag;
        $this->twig = $twig;
        $this->mailer = $mailer;
        $this->params = $params;
        $this->security = $security;
        $this->postsLoading = $postsLoading;
    }

    public function contactForm(Request $request)
    {
        $enquiry = new Contact();
        $form = $this->formFactory->create(ContactType::class, $enquiry);
        $this->request = $request;

        if ($this->request->getMethod() == 'POST') {
            $form->handleRequest($this->request);

            if ($form->isValid()) {
                $message = (new \Swift_Message('I am contacting you'))
                    ->setFrom('contact@example.com')
                    ->setTo($this->params->get('app.emails.contact_email'))
                    ->setBody($this->twig->render('contact/contactEmail.txt.twig', array('enquiry' => $enquiry)));
                $this->mailer->send($message);

                $this->flashBag->add('notice', "form.success");
                return null;
            }
        }

        return $form;
    }

    public function commentForm(Request $request, Blog $blog)
    {
        $comment = new Comment();
        $form = $this->formFactory->create(CommentType::class, $comment);
        $this->request = $request;

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
                $this->postsLoading->myPersist($comment);

                return null;
            }
        }

        return $form;
    }

    public function addPostForm(Request $request) {
        $blog = new Blog();
        $form = $this->formFactory->create(BlogPostFormType::class, $blog);
        $this->request = $request;

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $blog->setAuthor($this->security->getUser());

                $this->postsLoading->myPersist($blog);

                return null;
            }
        }

        return $form;
    }

    public function editPostForm(Request $request, Blog $blog) {
        $form = $this->formFactory->create(BlogPostFormType::class, $blog);
        $this->request = $request;

        if ('POST' == $request->getMethod()) {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $this->postsLoading->myFlush();

                return null;
            }
        }

        return $form;
    }
}