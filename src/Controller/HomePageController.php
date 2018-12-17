<?php

namespace App\Controller;

use App\Handler\ContactFormHandler;
use App\Service\DatabaseService;
use App\Service\FormHandler;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class HomePageController extends Controller
{
    private $dbService;
    private $contactHandler;

    public function __construct(
        ContactFormHandler $contactHandler,
        DatabaseService $dbService
    ){
        $this->dbService = $dbService;
        $this->contactHandler = $contactHandler;
    }

    /**
     * @Route("/", name="homepage")
     */
    public function index()
    {
        $blogs = $this->dbService->loadHomepagePosts();

        return $this->render('homepage/index.html.twig', [
            'blogs' => $blogs
        ]);
    }
  
    /**
     * @Route("/about", name="about")
     */
    public function about()
    {
        return $this->render('about/about.html.twig');
    }

    /**
     * @Route("/contact", name="contact")
     */
    public function contact(Request $request)
    {
        $form = $this->contactHandler->handle($request);

        if($form === null)
            return $this->redirect('contact');

        return $page = $this->render('contact/contact.html.twig', array(
            'form' => $form->createView()
        ));
    }
  
    /**
     * @Route("/search", name="search")
     */
    public function search(Request $request) {
        $blogs = $this->dbService->loadSearchPosts($request);

        return $this->render('search/search.html.twig', array(
            'blogs' => $blogs
        ));
    }

    /**
     * @Route("/sidebar", name="sidebar")
     */
    public function sidebar()
    {
        $comments = $this->dbService->loadSidebarComments();

        return $this->render('sidebar/sidebar.html.twig', array(
            'comments' => $comments
        ));
    }
}