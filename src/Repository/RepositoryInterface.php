<?php


namespace App\Repository;

interface RepositoryInterface
{
    /**
     * @param mixed $entity
     */
    public function saveWpersist($entity);

    /**
     * @param mixed $entity
     */
    public function save($entity);

    /**
     * @param mixed $entity
     */
    public function remove($entity);
}