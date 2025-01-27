"use client";

import { useRef } from "react";

import { motion, useInView } from "motion/react";

function HandwrittenNote() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 0,
        rotate: 0,
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        scale: isInView ? 1 : 0.8,
        y: isInView ? 20 : 0,
        rotate: isInView ? 2 : 0,
      }}
      transition={{
        type: "spring",
      }}
    >
      <div className="shadow-yello-50 w-fit select-none rounded border-2 border-yellow-200 bg-yellow-100 px-3 py-2">
        <p className="font-handwritten text-lg">Egg (16) = 200 taka</p>
        <p className="font-handwritten text-lg">Banana (1 hali) = 40 taka</p>
        <p className="font-handwritten text-lg">Milk (250 gm) = 30 taka</p>
        <p className="font-handwritten text-lg">Chicken (1 kg) = 200 taka</p>
      </div>
    </motion.div>
  );
}

export default function Page() {
  return (
    <main className="bg-red-100">
      {/* first animated block */}
      <div className="min-h-svh bg-white">
        <HandwrittenNote />
      </div>
      {/* rest of the page */}
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
        laborum sit. Officia ab totam consequatur commodi, illo laborum nam
        quia! Necessitatibus magni ipsam nam expedita repudiandae fugiat
        reiciendis eveniet illo? Veniam voluptas dignissimos voluptates
        explicabo amet repellat error laudantium voluptate nam nemo neque
        consequatur architecto asperiores, delectus natus praesentium. Ullam
        facere culpa, repellendus vel dolorem quaerat. Iusto molestiae
        praesentium voluptates! Fuga nemo maiores debitis, molestias natus illum
        quo dicta sapiente minima doloribus sint maxime porro culpa tenetur
        nobis error delectus earum dignissimos nihil consequuntur rem dolore
        excepturi? Qui, animi facere. Nihil quaerat, quis aperiam eum, similique
        reiciendis qui veritatis, eaque sed saepe quam? Veniam consequuntur
        nostrum fuga eveniet sapiente dignissimos similique nisi culpa
        voluptatem repudiandae, quasi id voluptatum? Molestias, doloribus. Quae
        rerum nostrum, earum asperiores voluptatum perspiciatis esse aperiam
        quam repellendus officiis voluptate enim molestias consequatur odit, at
        quas non velit repellat tempora, sequi excepturi. Commodi sunt deleniti
        nulla magni. Nulla veritatis autem, aliquid quod quam sunt consequatur
        libero! Nulla, vel et unde aperiam, earum voluptatum mollitia porro quam
        esse amet officiis fugiat tenetur quas maxime ea ipsa eligendi odit.
        Dolorum, deleniti molestias minima tempore quasi temporibus architecto
        illum. Ipsum quaerat quisquam, est cum esse nisi nulla debitis assumenda
        cumque adipisci ex tempora eius quia repellendus consequuntur
        reprehenderit obcaecati consectetur! Quis recusandae vel illum laborum
        magnam officiis impedit, quibusdam doloremque consectetur at quaerat
        libero quos facilis earum explicabo est sint adipisci voluptatibus
        dolorem maiores. Repellat quod explicabo rem libero esse. Veniam
        recusandae fuga nemo natus repellendus quod vel veritatis optio.
        Sapiente fuga quia eius facilis alias. Unde molestiae consectetur alias
        natus esse, dolores nesciunt! Recusandae ratione corporis consequuntur
        vel iure! Ea eius, ducimus, nemo laudantium sit sapiente aperiam ut
        harum quae ad quo temporibus est quos suscipit delectus debitis animi
        dolore voluptatem nam magni ratione. Sed ratione qui quos magnam!
      </div>
    </main>
  );
}

// export default async function Page() {
//   return (
//     <main className="relative">
//       <div className="flex min-h-dvh items-center justify-center">
//         <div className="flex flex-col items-center">
//           <AnimatedElement delay={false} direction="up">
//             <div className="flex items-center">
//               <Icons.logo className="mr-2 h-7 w-7" />
//               <h1
//                 className="text-3xl font-semibold tracking-tight"
//                 translate="no"
//               >
//                 {APP_NAME}
//               </h1>
//             </div>
//           </AnimatedElement>
//           <AnimatedElement delay={true} direction="up">
//             <div className="mt-8 flex w-full items-center justify-center gap-4">
//               <Button asChild variant="outline">
//                 <Link href="/sign-up">Sign up</Link>
//               </Button>
//               <Button asChild>
//                 <Link href="/sign-in">Sign in</Link>
//               </Button>
//             </div>
//           </AnimatedElement>
//         </div>
//       </div>
//       <AnimatedElement delay={true} direction="down">
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-muted-foreground">
//           <p>Currently under active development</p>
//         </div>
//       </AnimatedElement>
//     </main>
//   );
// }
