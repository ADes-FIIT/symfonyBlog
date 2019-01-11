<?php

namespace App\Factory;

use App\Entity\Comment;
use App\Entity\Contact;
use Symfony\Component\Security\Core\Security;
use App\Entity\Blog;

class EntityFactory
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @return Blog new Blog object with Author set
     */
    public function createBlogPost(): Blog
    {
        $blog = new Blog();
        $blog->setAuthor($this->security->getUser());

        return $blog;
    }

    /**
     * @param Blog $blog The post that is the comment associated to
     * @return Comment new Comment object
     */
    public function createComment(Blog $blog): Comment
    {
        $comment = new Comment();
        $comment->setBlog($blog);
        $user = $this->security->getUser();
        if(null != $user)
            $comment->setAuthor($user);

        return $comment;
    }

    /**
     * @return Contact new Cotact object
     */
    public function createContact(): Contact
    {
        $contact = new Contact();

        return $contact;
    }
}