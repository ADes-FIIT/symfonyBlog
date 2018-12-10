<?php

namespace App\Service;

use App\Entity\Blog;
use App\Repository\BlogRepository;


/**
 * Class PostsLoading
 * @package App\Service
 */
class PostsLoading
{
    public function loadHomepage ()
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('App:Blog');
        $blogs = $repo->loadBlogs();

        return $blogs;
    }
}