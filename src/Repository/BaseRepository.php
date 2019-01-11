<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

abstract class BaseRepository extends ServiceEntityRepository implements RepositoryInterface
{
    public function __construct(RegistryInterface $registry, String $entity)
    {
        parent::__construct($registry, $entity);
    }

    /**
     * @param mixed $entity
     * @return null only when unsuccessful
     */
    public function saveWpersist($entity)
    {
        try {
            $this->_em->persist($entity);
        }
        catch(\Doctrine\ORM\ORMException $ex) {
            return null;
        }

        try {
            $this->_em->flush($entity);
        }
        catch(\Doctrine\ORM\ORMException $ex) {
            return null;
        }
    }

    /**
     * @param mixed $entity
     * @return null only when unsuccessful
     */
    public function save($entity)
    {
        try {
            $this->_em->flush($entity);
        }
        catch(\Doctrine\ORM\ORMException $ex) {
            return null;
        }
    }

    /**
     * @param mixed $entity
     * @return null only when unsuccessful
     */
    public function remove($entity)
    {
        try {
            $this->_em->remove($entity);
        }
        catch(\Doctrine\ORM\ORMException $ex) {
            return null;
        }

        try {
            $this->_em->flush($entity);
        }
        catch(\Doctrine\ORM\ORMException $ex) {
            return null;
        }
    }
}