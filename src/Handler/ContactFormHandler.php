<?php

namespace App\Handler;

use App\Entity\Contact;
use App\Form\ContactType;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\Templating\EngineInterface;

class ContactFormHandler
{
    private $formFactory;
    private $flashBag;
    private $twig;
    private $mailer;
    private $mailTo;

    public function __construct(
        FormFactoryInterface $formFactory,
        FlashBagInterface $flashBag,
        \Swift_Mailer $mailer,
        EngineInterface $twig,
        String $mailTo
    ){
        $this->formFactory = $formFactory;
        $this->flashBag = $flashBag;
        $this->twig = $twig;
        $this->mailer = $mailer;
        $this->mailTo = $mailTo;
    }

    public function handle(Request $request)
    {
        $enquiry = new Contact();
        $form = $this->formFactory->create(ContactType::class, $enquiry);

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $message = (new \Swift_Message('I am contacting you'))
                    ->setFrom('contact@example.com')
                    ->setTo($this->mailTo)
                    ->setBody($this->twig->render('contact/contactEmail.txt.twig', array('enquiry' => $enquiry)));
                $this->mailer->send($message);

                $this->flashBag->add('notice', "form.success");
                return null;
            }
        }

        return $form;
    }
}