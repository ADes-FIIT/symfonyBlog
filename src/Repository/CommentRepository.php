<?php

namespace App\Repository;

use App\Entity\Comment;
use Symfony\Bridge\Doctrine\RegistryInterface;

class CommentRepository extends BaseRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    /**
     * @param $blog
     * @return Comment[] Array of comments associated to blog
     */
    public function getCommentsForBlog($blog): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.blog = :val')
            ->setParameter('val', $blog)
            ->orderBy('a.id', 'ASC')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * @return Comment[] Array of comments for homepage
     */
    public function getCommentsForHomepage(): array
    {
        return $this->createQueryBuilder('a')
            ->orderBy('a.id', 'DESC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
            ;
    }
}