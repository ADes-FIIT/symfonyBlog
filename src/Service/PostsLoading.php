<?php

namespace App\Service;

use App\Entity\Blog;
use App\Repository\BlogRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

/**
 * Class PostsLoading
 * @package App\Service
 */
class PostsLoading
{
    private $em;
    private $security;

    public function __construct(
        EntityManagerInterface $em,
        Security $security
    ){
        $this->em = $em;
        $this->security = $security;
    }

    public function loadHomepagePosts ()
    {
        $repo = $this->em->getRepository('App:Blog');
        $blogs = $repo->loadBlogs();

        return $blogs;
    }

    public function loadSearchPosts (Request $request)
    {
        $repo = $this->em->getRepository('App:Blog');
        $blogs = $repo->searchBlogs($request->get('q'));

        return $blogs;
    }

    public function loadSidebarComments ()
    {
        $repo = $this->em->getRepository('App:Comment');
        $comments= $repo->getCommentsForHomepage();

        return $comments;
    }

    public function loadShowPost ($pageid)
    {
        $repo = $this->em->getRepository('App:Blog');
        $blog = $repo->find($pageid);

        return $blog;
    }

    public function loadShowComments ($pageid)
    {
        $repo =  $this->em->getRepository('App:Comment');
        $comments= $repo->getCommentsForBlog($pageid);

        return $comments;
    }

    public function myPersist($object)
    {
        $this->em->persist($object);
        $this->em->flush();
    }

    public function loadMyPosts(){
        $repo = $this->em->getRepository('App:Blog');
        $blogs = $repo->findUserBlogs($this->security->getUser());

        return $blogs;
    }

    public function loadEditPost($id){
        $repo = $this->em->getRepository('App:Blog');
        $blog = $repo->findBlogById($id);

        return $blog;
    }

    public function myFlush() {
        $this->em->flush();
    }

    public function deleteMyPost($id) {
        $repo = $this->em->getRepository('App:Blog');
        $blog = $repo->findBlogById($id);
        $this->em->remove($blog);

        $repo = $this->em->getRepository('App:Comment');
        $comments = $repo->getCommentsForBlog($id);
        foreach ($comments as $comment) {
            $this->em->remove($comment);
        }

        $this->em->flush();
    }
}