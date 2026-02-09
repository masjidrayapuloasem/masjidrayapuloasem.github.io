import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Link } from "react-router-dom";
import { truncateText } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
}

export function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Use public view to prevent admin UUID exposure
        const { data, error } = await supabase
          .from("articles_public")
          .select("id, title, slug, content, image_url, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

        if (!error && data) {
          setArticles(data);
        }
      } catch {
        // Silently handle errors to avoid information leakage
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Don't render section if no articles
  if (!isLoading && articles.length === 0) {
    return null;
  }


  return (
    <section id="artikel" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <span className="text-secondary font-arabic text-xl">المقالات</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Artikel Terbaru
          </h2>
          <div className="section-divider w-32 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bacaan islami, kajian, dan informasi bermanfaat dari Masjid Raya Pulo Asem
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-elevated transition-shadow group">
                {article.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className={article.image_url ? "pt-4" : "pt-6"}>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      {format(new Date(article.created_at), "dd MMMM yyyy", { locale: localeId })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  {article.content && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {truncateText(article.content)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
