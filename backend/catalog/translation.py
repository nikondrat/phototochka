from modeltranslation.translator import register, TranslationOptions
from .models import Category, Orientation

@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(Orientation)
class OrientationTranslationOptions(TranslationOptions):
    fields = ('name',)
