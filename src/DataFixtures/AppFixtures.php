<?php
namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\Blog;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $blog1 = new Blog();
        $blog1->setTitle('<h1>A day with Symfony 4</h1>');
        $blog1->setBlog('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mauris in nulla faucibus ultrices. Fusce ut ex nisl. Morbi lacus neque, vestibulum ut dolor eu, pulvinar dapibus dolor. Quisque posuere nulla vitae arcu elementum vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer vitae volutpat augue. Curabitur vel enim massa. Nullam quis tristique quam. Quisque eu lorem convallis, accumsan lorem ac, auctor ligula. Vestibulum vehicula, lectus in pretium fringilla, augue urna aliquam arcu, ac semper lectus quam tristique sem. Morbi bibendum dui nec sem vulputate, nec pretium ex accumsan. Proin at neque porta, pellentesque justo eget, hendrerit neque. Sed tempor ligula id ante faucibus, a hendrerit orci finibus.</p><p>Integer pellentesque leo a est luctus efficitur. Proin scelerisque diam ut tristique malesuada. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec lectus dolor, interdum non magna vel, molestie vehicula augue. Nulla at aliquam lorem. Maecenas mattis nibh eget urna maximus molestie. Vestibulum quis enim blandit, ultricies lectus at, ornare leo. Cras sit amet lobortis dolor, ut elementum leo. Sed hendrerit a diam in aliquet. Ut ultricies aliquet faucibus. Vestibulum porttitor semper gravida. Vivamus pellentesque justo sapien, vitae bibendum lectus sodales sed.</p><p>Donec sagittis gravida justo, imperdiet ullamcorper nisi mattis non. Nulla fermentum ipsum urna, ac euismod orci ornare vitae. Maecenas ac vulputate sapien. Aenean posuere sem non sem faucibus cursus. Praesent consequat id leo eget finibus. Suspendisse tincidunt ultricies ultricies. Phasellus hendrerit sed dolor ac tempus. Pellentesque eget lectus sed felis sagittis vulputate et ac lectus. Phasellus accumsan sit amet tellus id ultricies.</p><p>Donec nec auctor metus. Morbi laoreet sollicitudin elit, dictum aliquam quam consectetur et. Phasellus eget tortor et quam eleifend tristique sed eget leo. Suspendisse vestibulum imperdiet congue. Donec tempor, quam vitae hendrerit tempus, metus magna tincidunt lorem, vel maximus massa nibh in ipsum. Morbi porta porttitor pellentesque. Nunc auctor a lorem malesuada mollis. Vivamus nec posuere felis. Donec vulputate convallis purus quis aliquet. Nam euismod metus in facilisis pharetra. Praesent tempus ornare dolor vitae interdum. Nullam iaculis, sem et porta varius, nisl lectus ultricies neque, aliquam sollicitudin ex diam sit amet metus. Cras semper posuere.</p>');
        $blog1->setAuthor('dsyph3r');
        $blog1->setTags('symfony4, php, paradise, symblog, hubshark, mustangx');
        $manager->persist($blog1);

        $blog2 = new Blog();
        $blog2->setTitle('<h1>The pool on the roof must have a leak</h1>');
        $blog2->setBlog('Vestibulum vulputate mauris eget erat congue dapibus imperdiet justo scelerisque. Na. Cras elementum molestie vestibulum. Morbi id quam nisl. Praesent hendrerit, orci sed elementum lobortis.');
        $blog2->setAuthor('Zero Cool');
        $blog2->setTags('pool, leaky, hacked, movie, hacking, symblog, hubshark, mustangx');
        $manager->persist($blog2);

        $blog3 = new Blog();
        $blog3->setTitle('<h1>Misdirection. What the eyes see and the ears hear, the mind believes</h1>');
        $blog3->setBlog('Lorem ipsumvehicula nunc non leo hendrerit commodo. Vestibulum vulputate mauris eget erat congue dapibus imperdiet justo scelerisque.');
        $blog3->setAuthor('Gabriel');
        $blog3->setTags('misdirection, magic, movie, hacking, symblog, hubshark, mustangx');
        $manager->persist($blog3);

        $blog4 = new Blog();
        $blog4->setTitle('<h1>The grid - A digital frontier</h1>');
        $blog4->setBlog('Lorem commodo. Vestibulum vulputate mauris eget erat congue dapibus imperdiet justo scelerisque. Nulla consectetur tempus nisl vitae viverra.');
        $blog4->setAuthor('Kevin Flynn');
        $blog4->setTags('grid, daftpunk, movie, symblog, hubshark, mustangx');
        $manager->persist($blog4);

        $blog5 = new Blog();
        $blog5->setTitle('<h1>You\'re either a one or a zero. Alive or dead</h1>');
        $blog5->setBlog('Lorem ipsum dolor sit amet, consectetur adipiscing elittibulum vulputate mauris eget erat congue dapibus imperdiet justo scelerisque.');
        $blog5->setAuthor('Gary Winston');
        $blog5->setTags('binary, one, zero, alive, dead, !trusting, movie, symblog, hubshark, mustangx');
        $manager->persist($blog5);

        $manager->flush();
    }

}