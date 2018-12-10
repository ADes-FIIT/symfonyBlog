<?php
// src/controller/HomePageController.php
namespace App\Controller;

use App\Service\PostsLoading;
use App\Service\FormHandler;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use App\Entity\Contact;
use App\Form\ContactType;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\BlogRepository;

class HomePageController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function index(PostsLoading $loading)
    {
        $blogs = $loading->loadHomepage();
        if (!$blogs) {
            throw $this->createNotFoundException('Unable to find Blog post/s.');
        }

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
    public function contact(Request $request, FormHandler $formHandler)
    {
        $enquiry = new Contact();
        $form = $this->createForm(ContactType::class, $enquiry);

        $this->request = $request;
        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $message = (new \Swift_Message('Contact enquiry from Example'))
                    ->setFrom('contact@example.com')
                    ->setTo($this->container->getParameter('app.emails.contact_email'))
                    ->setBody($this->renderView('contact/contactEmail.txt.twig', array('enquiry' => $enquiry)));
                $this->get('mailer')->send($message);

                $this->addFlash('notice', "Your contact enquiry was successfully sent. Thank you!");

                return $this->redirect($this->generateUrl('contact'));
            }
        }

        return $this->render('contact/contact.html.twig', array(
            'form' => $form->createView()
        ));
    }
  
    /**
     * @Route("/search", name="search")
     */
    public function search(Request $request) {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Blog');
        $title = $request->get('q');

        $blogs = $repo->searchBlogs($title);

        if (!$blogs) {
            return $this->render('search/search.html.twig');
        }

        return $this->render('search/search.html.twig', [
            'blogs'      => $blogs
        ]);
    }

    /**
     * @Route("/sidebar", name="sidebar")
     */
    public function sidebar()
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Comment');
        $comments= $repo->getCommentsForHomepage();

        return $this->render('sidebar/sidebar.html.twig', array(
            'comments' => $comments
        ));
    }
}