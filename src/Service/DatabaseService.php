<?php

namespace App\Service;

use App\Entity\Blog;
use App\Repository\BlogRepository;
use App\Repository\CommentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class DatabaseService
{
    private $em;
    private $security;
    private $commentRepo;
    private $blogRepo;

    public function __construct(
        EntityManagerInterface $em,
        Security $security,
        BlogRepository $blogRepo,
        CommentRepository $commentRepo
    ){
        $this->em = $em;
        $this->security = $security;
        $this->commentRepo = $commentRepo;
        $this->blogRepo = $blogRepo;
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

    public function deleteMyPost($id) {
        $repo = $this->em->getRepository('App:Blog');
        $blog = $repo->findBlogById($id);
        $this->blogRepo->remove($blog);

        $repo = $this->em->getRepository('App:Comment');
        $comments = $repo->getCommentsForBlog($id);
        foreach ($comments as $comment) {
            $this->commentRepo->remove($comment);
        }
    }
}