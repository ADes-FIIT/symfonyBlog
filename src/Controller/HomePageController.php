<?php

namespace App\Controller;

use App\Handler\ContactFormHandler;
use App\Service\DatabaseService;
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
     * @return mixed rendered page
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
     * @return mixed rendered page
     */
    public function about()
    {
        return $this->render('about/about.html.twig');
    }

    /**
     * @Route("/contact", name="contact")
     * @param Request $request The one and only request
     * @return mixed rendered page
     */
    public function contact(Request $request)
    {
        $form = $this->contactHandler->handle($request);

        if($form === null)
            return $this->redirect('contact');

        return $this->render('contact/contact.html.twig', array(
            'form' => $form->createView()
        ));
    }
  
    /**
     * @Route("/search", name="search")
     * @param Request $request The one and only request
     * @return mixed rendered page
     */
    public function search(Request $request) {
        $blogs = $this->dbService->loadSearchPosts($request);

        return $this->render('search/search.html.twig', array(
            'blogs' => $blogs
        ));
    }

    /**
     * @Route("/sidebar", name="sidebar")
     * @return mixed rendered page
     */
    public function sidebar()
    {
        $comments = $this->dbService->loadSidebarComments();

        return $this->render('sidebar/sidebar.html.twig', array(
            'comments' => $comments
        ));
    }
}