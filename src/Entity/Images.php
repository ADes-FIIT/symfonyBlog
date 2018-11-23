<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ImagesRepository")
 */
class Images
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $source;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $blogId;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $commentId;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSource(): ?string
    {
        return $this->source;
    }

    public function setSource(string $source): self
    {
        $this->source = $source;

        return $this;
    }

    public function getBlogId(): ?int
    {
        return $this->blogId;
    }

    public function setBlogId(?int $blogId): self
    {
        $this->blogId = $blogId;

        return $this;
    }

    public function getCommentId(): ?int
    {
        return $this->commentId;
    }

    public function setCommentId(?int $commentId): self
    {
        $this->commentId = $commentId;

        return $this;
    }
}
