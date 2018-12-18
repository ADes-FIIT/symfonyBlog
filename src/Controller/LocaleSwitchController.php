<?php
// src/Controller/LocaleSwitchController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class LocaleSwitchController extends AbstractController {

    /**
     * @Route("/switch/{locale}", name="switch_language", defaults={"locale"="en"}, requirements={"locale"="en|sk"})
     */
    public function switchLanguage(String $locale) {
        $this->get('session')->set('_locale', $locale);
        return $this->redirect($this->get('session')->get('prevRoute'));
    }
}