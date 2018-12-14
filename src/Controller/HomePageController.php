<?php

namespace App\Controller;

use App\Service\PostsLoading;
use App\Service\FormHandler;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class HomePageController extends Controller
{
    private $formHandler;
    private $postLoading;

    public function __construct(
        FormHandler $formHandler,
        PostsLoading $postsLoading
    ){
        $this->formHandler = $formHandler;
        $this->postLoading = $postsLoading;
    }

    /**
     * @Route("/", name="homepage")
     */
    public function index()
    {
        $blogs = $this->postLoading->loadHomepagePosts();

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
        $form = $this->formHandler->contactForm($request);

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
        $blogs = $this->postLoading->loadSearchPosts($request);

        return $this->render('search/search.html.twig', array(
            'blogs' => $blogs
        ));
    }

    /**
     * @Route("/sidebar", name="sidebar")
     */
    public function sidebar()
    {
        $comments = $this->postLoading->loadSidebarComments();

        return $this->render('sidebar/sidebar.html.twig', array(
            'comments' => $comments
        ));
    }
}