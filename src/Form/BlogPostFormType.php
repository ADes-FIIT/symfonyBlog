<?php

namespace App\Form;

use App\Entity\Blog;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use FOS\CKEditorBundle\Form\Type\CKEditorType;

class BlogPostFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', CKEditorType::class, array(
                'data' => '<h1>Enter title here</h1>',
                'label' => false,
                'inline' => true,
                'config' => array(
                    'format_tags' => 'h1'
                ),
            ))
            ->add('blog', CKEditorType::class, array(
                'data' => '<p>Enter post text here</p>',
                'label' => false,
                'config' => array(
                    'format_tags' => 'h2;h3;h4;h5;h6;address;div;p',
                    'height' => 300
                ),
            ))
            ->add('tags', CKEditorType::class, array(
                'data' => '<p>Enter tags here</p>',
                'label' => false,
                'inline' => true,
                'config' => array(
                    'format_tags' => 'p'
                ),
            ))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Blog::class,
        ]);
    }
}
