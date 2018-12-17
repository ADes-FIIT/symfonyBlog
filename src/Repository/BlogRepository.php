<?php

namespace App\Repository;

use App\Entity\Blog;
use App\Entity\User;
use Symfony\Bridge\Doctrine\RegistryInterface;

class BlogRepository extends BaseRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Blog::class);
    }

    /**
     * @return Blog[] Returns an array of Blog objects
     */
    public function loadBlogs() :array
    {
        return $this->findBy(array(), array('id' => 'DESC'));
    }

    /**
     * @param User $user
     * @return Blog[] Returns an array of Blog objects
     */
    public function findUserBlogs(User $user) :array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.author = :val')
            ->setParameter('val', $user)
            ->orderBy('a.id', 'DESC')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * @param int $id ID of post to be found
     * @return Blog Returns one blog object or null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findBlogById(int $id): ?Blog
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.id= :val')
            ->setParameter('val', $id)
            ->getQuery()
            ->getOneOrNullResult()
            ;
    }

    /**
     * @param String $title Title to search for
     * @return Blog[] Returns an array of Blog objects
     */
    public function searchBlogs(String $title): array
    {
        $title = $this->sanitizeSearchQuery($title);
        $searchTerms = $this->extractSearchTerms($title);

        $queryBuilder = $this->createQueryBuilder('a');

        foreach ($searchTerms as $key => $term) {
            $queryBuilder
                ->orWhere('a.title LIKE :t_'.$key)
                ->orWhere('a.tags LIKE :t_'.$key)
                ->setParameter('t_'.$key, '%'.$term.'%')
            ;
        }

        return $queryBuilder
            ->orderBy('a.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param String $query String to be sanitized
     * @return String Removed all non-alphanumeric characters except whitespaces.
     */
    private function sanitizeSearchQuery(String $query): String
    {
        return trim(preg_replace('/[[:space:]]+/', ' ', $query));
    }

    /**
     * Splits the search query into terms and removes the ones which are irrelevant.
     * @param String $searchQuery
     * @return array String split to words w length > 2
     */
    private function extractSearchTerms(String $searchQuery): array
    {
        $terms = array_unique(explode(' ', $searchQuery));

        return array_filter($terms, function ($term) {
            return 2 <= mb_strlen($term);
        });
    }
}