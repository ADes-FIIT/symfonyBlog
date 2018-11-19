<?php
// src/controller/HomePageController.php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use App\Entity\Contact;
use App\Form\ContactType;
use Symfony\Component\HttpFoundation\Request;
  
class HomePageController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function index()
    {
        return $this->render('homepage/index.html.twig');
    }
  
    /**
     * @Route("/about", name="about")
     */
    public function about() {
        return $this->render('about/about.html.twig');
    }

    /**
     * @Route("/contact", name="contact")
     * @Method("GET|POST")
     */
    public function contact(Request $request)
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

                $this->get('session')->getFlashbag('blog-notice', 'Your contact enquiry was successfully sent. Thank you!');


                // Redirect - This is important to prevent users re-posting
                // the form if they refresh the page
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
    public function search() {
        return $this->render('search/search.html.twig');
    }

    /**
     * @Route("/sidebar", name="sidebar")
     */
    public function sidebar()
    {
        return $this->render('sidebar/sidebar.html.twig');
    }
}