<?php

namespace App\Factory;

use App\Entity\Contact;
use Symfony\Component\Templating\EngineInterface;

class MessageFactory
{
    private $mailTo;
    private $twig;

    public function __construct(
        String $mailTo,
        EngineInterface $twig
    ){
        $this->mailTo = $mailTo;
        $this->twig = $twig;
    }

    /**
     * @param Contact Contact entity
     * @return \Swift_Message new ContactMessage
     */
    public function createContactMail(Contact $contact) :\Swift_Message
    {
        $message = (new \Swift_Message('Reader contact'))
            ->setFrom($contact->getEmail())
            ->setTo($this->mailTo)
            ->setBody($this->twig->render('contact/contactEmail.txt.twig', array('enquiry' => $contact)));

        return $message;
    }
}