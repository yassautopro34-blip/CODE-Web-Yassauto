import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: "/livraison-retours",
    title: "Livraison, retours et garanties - Boutique YASSAUTO",
    description:
      "Conditions de livraison, de rétractation, de retour et de garantie des produits vendus sur la boutique YASSAUTO (Gigean).",
  }),
};

const Section = ({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24 space-y-3 text-sm leading-7 text-zinc-700">
    <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
    {children}
  </section>
);

const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="list-disc space-y-1.5 pl-5">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const EMAIL = "yassauto.pro34@gmail.com";
const Mail = () => (
  <a className="font-semibold text-brand-red underline" href={`mailto:${EMAIL}`}>
    {EMAIL}
  </a>
);

export default function ShippingReturnsPage() {
  return (
    <article className="min-h-screen bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-10 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-black text-zinc-900">Livraison, retours et garanties</h1>
          <p className="text-sm text-zinc-500">Boutique YASSAUTO · Dernière mise à jour : 1er octobre 2026</p>
          <p className="text-sm leading-7 text-zinc-700">
            Les présentes conditions complètent nos{" "}
            <Link className="font-semibold text-brand-red underline" href="/cgv">conditions générales de vente</Link>. Elles
            s’appliquent à toute commande passée sur la boutique en ligne de YASSAUTO MKLF. Merci de les lire
            attentivement avant de commander : en validant votre commande, vous déclarez les avoir acceptées.
          </p>
        </header>

        {/* Résumé */}
        <div className="rounded-xl border-l-4 border-brand-red bg-red-50 p-5 text-sm leading-7 text-zinc-800">
          <p className="mb-2 font-bold text-zinc-900">L’essentiel en 6 points</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Vous disposez de 14 jours après réception pour vous rétracter, en nous écrivant <strong>avant</strong> tout renvoi.</li>
            <li>Les frais de retour sont <strong>entièrement à votre charge</strong>, et le retour se fait uniquement à notre atelier de Gigean.</li>
            <li>Vous pouvez déballer et examiner le produit comme en magasin, <strong>mais pas l’installer ni l’utiliser</strong>.</li>
            <li>Un produit installé, branché sur le véhicule, collé, découpé, incomplet ou abîmé subit une décote pouvant aller <strong>jusqu’à 100 % de son prix</strong>.</li>
            <li>Les produits personnalisés et les poses réalisées avec votre accord ne sont pas remboursables au titre de la rétractation.</li>
            <li>Un produit défectueux relève de la garantie légale : contactez-nous d’abord, nous trouvons la solution.</li>
          </ol>
        </div>

        <Section id="expedition" title="1. Expédition et délais de livraison">
          <p>
            Les produits de la boutique sont expédiés directement par nos fournisseurs partenaires, depuis leurs
            entrepôts, le plus souvent situés hors de l’Union européenne. Le délai de livraison estimé est indiqué sur
            chaque fiche produit et rappelé dans l’email de confirmation de commande. Il court à compter de la
            confirmation du paiement.
          </p>
          <p>
            Sauf délai différent indiqué sur la fiche produit, YASSAUTO s’engage à livrer au plus tard
            <strong> 30 jours</strong> après la commande. En cas de dépassement de ce délai, vous pouvez nous mettre en
            demeure de livrer dans un délai supplémentaire raisonnable ; à défaut de livraison dans ce nouveau délai,
            vous pouvez résoudre la vente par écrit et être remboursé dans les 14 jours.
          </p>
          <p>
            Les frais de livraison à domicile sont inclus dans le prix affiché. Les droits et taxes d’importation
            éventuels sont également inclus : aucun frais supplémentaire ne vous sera réclamé à la livraison par
            YASSAUTO.
          </p>
          <p>Une commande peut être livrée en plusieurs colis. Un numéro de suivi vous est transmis par email dès qu’il est disponible.</p>
        </Section>

        <Section id="adresse" title="2. Adresse de livraison">
          <List
            items={[
              "Vous êtes seul responsable de l’exactitude et de la complétude de l’adresse saisie (numéro, nom sur la boîte aux lettres, code d’accès, téléphone joignable).",
              "Aucune modification d’adresse n’est possible une fois la commande transmise au fournisseur.",
              "En cas d’adresse erronée ou incomplète, ou de colis non retiré dans le délai fixé par le transporteur, le colis peut nous être retourné. Une nouvelle expédition ne sera effectuée qu’après paiement des frais de réexpédition réellement facturés. Si vous ne souhaitez pas de nouvelle expédition, la commande est remboursée, déduction faite des frais d’expédition et de retour réellement supportés par YASSAUTO.",
            ]}
          />
        </Section>

        <Section id="reception" title="3. À la réception de votre colis">
          <p>Pour nous permettre d’agir rapidement contre le transporteur, nous vous demandons :</p>
          <List
            items={[
              "de vérifier l’état extérieur du colis en présence du livreur lorsque c’est possible, et de noter des réserves précises en cas de colis ouvert, écrasé ou mouillé ;",
              "de nous signaler tout produit endommagé, manquant ou ne correspondant pas à votre commande dans les 48 heures suivant la réception, à l’adresse ci-dessous, avec des photos du colis, de l’étiquette d’expédition et du produit ;",
              "de conserver l’emballage d’origine et tous les éléments du colis jusqu’au traitement de votre réclamation.",
            ]}
          />
          <p className="text-xs text-zinc-500">
            Ces démarches facilitent le traitement de votre dossier ; elles ne privent pas le consommateur des droits
            que la loi lui reconnaît.
          </p>
        </Section>

        <Section id="atelier" title="4. Retrait et pose à l’atelier de Gigean">
          <List
            items={[
              "Le retrait s’effectue à l’atelier YASSAUTO, 7 rue André Marie Ampère, 34770 Gigean, aux heures d’ouverture, sur présentation d’une pièce d’identité et du numéro de commande.",
              "Vous êtes prévenu par email ou par téléphone dès l’arrivée du colis. Le produit est conservé 30 jours à compter de cet avis.",
              "Passé ce délai, et après une mise en demeure restée sans réponse pendant 15 jours, YASSAUTO pourra résoudre la vente et vous rembourser, déduction faite des frais d’expédition et de stockage réellement supportés.",
              "Si vous avez commandé une pose, le rendez-vous est fixé après réception et contrôle du produit. Le véhicule doit être présenté à l’heure convenue ; un rendez-vous manqué sans prévenir 24 heures à l’avance peut entraîner la facturation d’un nouveau déplacement de créneau.",
            ]}
          />
        </Section>

        <Section id="retractation" title="5. Droit de rétractation">
          <p>
            Conformément aux articles L221-18 et suivants du Code de la consommation, le consommateur dispose d’un
            délai de <strong>14 jours</strong> à compter de la réception du produit (ou du dernier colis en cas de
            livraison en plusieurs fois) pour se rétracter, sans avoir à motiver sa décision.
          </p>
          <p className="font-semibold text-zinc-900">Comment se rétracter</p>
          <p>
            Vous devez nous notifier votre décision <strong>avant tout renvoi</strong>, par une déclaration dénuée
            d’ambiguïté envoyée à <Mail />, en indiquant votre nom, votre numéro de commande, le produit concerné et sa
            date de réception. Vous pouvez utiliser le modèle de formulaire figurant en fin de page. Nous vous
            adressons sans délai un accusé de réception ainsi que les instructions de retour.
          </p>
          <p className="font-semibold text-zinc-900">Renvoi du produit</p>
          <List
            items={[
              <>Le produit doit nous être renvoyé <strong>au plus tard 14 jours</strong> après la notification de votre rétractation.</>,
              <>Il est renvoyé <strong>exclusivement à notre atelier</strong> : YASSAUTO MKLF, 7 rue André Marie Ampère, 34770 Gigean, France. Tout colis envoyé à une autre adresse, notamment au fournisseur, ne pourra pas être pris en compte.</>,
              <>Les frais de retour sont <strong>intégralement à votre charge</strong>. Nous vous recommandons fortement un envoi suivi et assuré à hauteur de la valeur du produit : vous supportez les risques du transport retour, et un colis perdu ou endommagé pendant le retour ne pourra pas être remboursé sans preuve d’envoi.</>,
              "Le produit doit être protégé dans un emballage adapté pour éviter toute casse. Vous pouvez aussi le déposer à l’atelier aux heures d’ouverture.",
              "Les colis envoyés en port dû ou contre remboursement sont refusés.",
            ]}
          />
        </Section>

        <Section id="etat" title="6. État du produit retourné et décote">
          <p>
            Comme dans un magasin, vous pouvez déballer le produit et l’examiner pour vérifier sa nature, ses
            caractéristiques et son bon fonctionnement apparent. Toute manipulation allant au-delà engage votre
            responsabilité : en application de l’article L221-23 du Code de la consommation, la dépréciation qui en
            résulte est déduite du remboursement.
          </p>
          <p>Sont notamment considérés comme des manipulations excédant le simple examen :</p>
          <List
            items={[
              "l’installation, même partielle, du produit dans un véhicule, ou son raccordement au faisceau électrique, aux connecteurs ou à l’alimentation du véhicule ;",
              "la dépose de garnitures, de façades, de tableaux de bord ou de pièces d’origine pour l’essayer ;",
              "le retrait des films de protection d’un écran, des protections adhésives ou le collage d’une bande LED ou de tout élément adhésif ;",
              "la découpe, le pliage, la modification ou le dénudage de câbles, de fibres ou de connecteurs ;",
              "l’appairage avec un compte, l’installation d’applications ou la modification de la configuration d’usine ;",
              "les rayures, chocs, traces de montage, salissures ou odeurs constatées au retour.",
            ]}
          />
          <p>
            Le produit doit être retourné <strong>complet</strong> : accessoires, câbles, faisceaux, visserie, notice,
            et si possible emballage d’origine en bon état. Tout élément manquant est déduit au prix de remplacement.
          </p>
          <p>
            L’état du produit est constaté à réception, photos à l’appui. La décote appliquée est proportionnée à la
            perte de valeur du produit et peut atteindre <strong>100 % du prix</strong> lorsque le produit ne peut plus
            être revendu comme neuf (par exemple : écran installé puis démonté, bande LED décollée, câbles découpés).
            Le détail de la décote vous est communiqué par écrit avant le remboursement.
          </p>
        </Section>

        <Section id="exceptions" title="7. Exceptions au droit de rétractation">
          <p>Conformément à l’article L221-28 du Code de la consommation, le droit de rétractation ne peut pas être exercé pour :</p>
          <List
            items={[
              "les produits confectionnés selon vos spécifications ou nettement personnalisés (par exemple : volant personnalisé, finition, couleur ou gravure sur demande) ;",
              "la prestation de pose réalisée à l’atelier lorsqu’elle a été pleinement exécutée avant la fin du délai de rétractation, à votre demande expresse et avec votre renoncement exprès à ce droit, recueillis lors de la commande ou de la prise de rendez-vous ;",
              "les produits qui, après livraison et de par leur nature, ont été mélangés de manière indissociable avec d’autres articles.",
            ]}
          />
          <p>
            Si vous vous rétractez sur un produit après l’avoir fait poser à l’atelier, la prestation de pose reste due,
            la dépose est facturée au tarif atelier en vigueur, et la décote prévue à l’article 6 s’applique au produit.
          </p>
        </Section>

        <Section id="remboursement" title="8. Remboursement">
          <List
            items={[
              "Le remboursement intervient dans un délai de 14 jours à compter de la réception de votre notification de rétractation.",
              "YASSAUTO peut différer ce remboursement jusqu’à la réception effective du produit à l’atelier, ou jusqu’à ce que vous ayez fourni une preuve d’expédition, la date retenue étant celle du premier de ces faits.",
              "Le remboursement porte sur le prix payé, frais de livraison standard inclus, diminué le cas échéant de la décote prévue à l’article 6 et du prix des éléments manquants. Les frais de retour ne sont pas remboursés.",
              "Il est effectué par le même moyen de paiement que celui utilisé pour la commande, sauf accord exprès de votre part pour un autre moyen, sans frais pour vous.",
            ]}
          />
        </Section>

        <Section id="garanties" title="9. Produit défectueux : garanties légales">
          <p>
            Indépendamment du droit de rétractation, tous les produits bénéficient de la garantie légale de conformité
            (articles L217-3 et suivants du Code de la consommation) pendant <strong>2 ans</strong> à compter de la
            livraison, et de la garantie des vices cachés (articles 1641 et suivants du Code civil).
          </p>
          <p className="font-semibold text-zinc-900">Avant tout retour, contactez-nous</p>
          <p>
            Écrivez à <Mail /> avec votre numéro de commande, une description du problème et des photos ou une courte
            vidéo. Beaucoup de pannes se règlent à distance (réglage, mise à jour, branchement). Si le défaut est
            confirmé, nous vous indiquons la marche à suivre ; les frais de retour d’un produit non conforme sont alors
            à notre charge. Un produit renvoyé sans accord préalable ne pourra être identifié et traité qu’avec retard.
          </p>
          <p>
            Vous pouvez choisir entre la réparation et le remplacement du produit, sauf si l’option choisie est
            impossible ou entraîne un coût manifestement disproportionné ; dans ce cas, l’autre option vous est
            proposée. À défaut, vous pouvez obtenir une réduction du prix ou la résolution de la vente.
          </p>
          <p className="font-semibold text-zinc-900">Ne relèvent pas des garanties</p>
          <List
            items={[
              "les dommages causés par une installation réalisée sans respecter la notice ou les règles de l’art, un mauvais branchement, une modification du produit ou du véhicule ;",
              "l’usure normale, les chocs, l’exposition à l’eau, à l’humidité ou à des températures excessives, un usage non conforme à la destination du produit ;",
              "l’incompatibilité avec un véhicule non mentionné dans la liste de compatibilité de la fiche produit, ou avec des équipements ajoutés après la sortie d’usine.",
            ]}
          />
          <p className="text-xs text-zinc-500">
            Pour les produits posés par notre atelier, la pose est garantie par YASSAUTO dans les mêmes conditions que
            nos prestations de mécanique.
          </p>
        </Section>

        <Section id="mediation" title="10. Réclamations et médiation">
          <p>
            Toute réclamation doit d’abord nous être adressée par écrit à <Mail /> ou par courrier à YASSAUTO MKLF,
            7 rue André Marie Ampère, 34770 Gigean. Nous y répondons dans les meilleurs délais.
          </p>
          <p>
            Si le litige n’est pas résolu, vous pouvez recourir gratuitement au médiateur de la consommation dont
            relève YASSAUTO, dans un délai d’un an à compter de votre réclamation écrite :
          </p>
          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="font-bold text-zinc-900">CM2C – Centre de la Médiation de la Consommation de Conciliateurs de Justice</p>
            <p>49 rue de Ponthieu, 75008 Paris</p>
            <p>
              Saisine en ligne :{" "}
              <a className="font-semibold text-brand-red underline" href="https://www.cm2c.net/declarer-un-litige.php" target="_blank" rel="noopener noreferrer">
                www.cm2c.net
              </a>{" "}
              · Email : declarer-un-litige@cm2c.net
            </p>
          </div>
          <p>À défaut d’accord amiable, le litige relève des tribunaux compétents selon les règles de droit commun.</p>
        </Section>

        <Section id="formulaire" title="Modèle de formulaire de rétractation">
          <p className="text-xs text-zinc-500">Veuillez compléter et renvoyer ce formulaire uniquement si vous souhaitez vous rétracter du contrat.</p>
          <div className="space-y-2 rounded-xl border border-dashed border-zinc-300 p-5 font-mono text-xs leading-6 text-zinc-800">
            <p>À l’attention de YASSAUTO MKLF, 7 rue André Marie Ampère, 34770 Gigean — {EMAIL} :</p>
            <p>Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*)/pour la prestation de services (*) ci-dessous :</p>
            <p>Numéro de commande : ……………………………</p>
            <p>Commandé le (*)/reçu le (*) : ……………………………</p>
            <p>Nom du (des) consommateur(s) : ……………………………</p>
            <p>Adresse du (des) consommateur(s) : ……………………………</p>
            <p>Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) :</p>
            <p>Date : ……………………………</p>
            <p>(*) Rayez la mention inutile.</p>
          </div>
        </Section>

        <footer className="border-t border-zinc-200 pt-6 text-xs leading-6 text-zinc-500">
          YASSAUTO MKLF · SARL au capital de 1 000 € · RCS Montpellier 101 781 854 · 7 rue André Marie Ampère, 34770
          Gigean · {EMAIL} · 06 48 38 05 68
        </footer>
      </div>
    </article>
  );
}
