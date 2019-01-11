<?php

namespace App\Handler;

use App\Factory\EntityFactory;
use App\Factory\MessageFactory;
use App\Form\ContactType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\Templating\EngineInterface;

class ContactFormHandler
{
    private $formFactory;
    private $flashBag;
    private $mailer;
    private $entityFactory;
    private $messageFactory;

    public function __construct(
        FormFactoryInterface $formFactory,
        FlashBagInterface $flashBag,
        \Swift_Mailer $mailer,
        EntityFactory $entityFactory,
        MessageFactory $messageFactory
    ){
        $this->formFactory = $formFactory;
        $this->flashBag = $flashBag;
        $this->mailer = $mailer;
        $this->entityFactory = $entityFactory;
        $this->messageFactory = $messageFactory;
    }

    public function handle(Request $request)
    {
        $contact = $this->entityFactory->createContact();
        $form = $this->formFactory->create(ContactType::class, $contact);

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $message = $this->messageFactory->createContactMail($contact);
                $this->mailer->send($message);
                $this->flashBag->add('notice', "form.success");

                return null;
            }
        }

        return $form;
    }
}